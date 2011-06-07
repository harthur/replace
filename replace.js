var fs = require("fs"),
    path = require("path"),
    colors = require("colors");

var excludes = [],
    includes,
    regex,
    flags = "gm", // global multiline
    canReplace,
    count = 0,
    limit = 400, // chars per line
    options;

module.exports = function(opts) {
    options = opts;
    regex = new RegExp(options.regex, flags);
    
    canReplace = !options.preview && options.replacement !== undefined;

    if (options.include) {
        includes = options.include.split(",").map(patternToRegex);
    }
    if (options.exclude) {
        excludes = options.exclude.split(",");
    }
    var list = fs.readFileSync(options.excludeList, "utf-8").split("\n");
    excludes = excludes.concat(list)
        .filter(function(line) {
            return line && line.indexOf("#");
        })
        .map(patternToRegex);
    
    if (!options.silent) {
        var verb = canReplace ? "Replaced" : "Found";
        console.log(verb + " occurences in these files:");
    }

    for (var i = 0; i < options.path.length; i++) {
        if(options.synchronous) {
            replacizeFileSync(options.path[i]);
        }
        else {
            replacizeFile(options.path[i]);         
        }
    }
}

function patternToRegex(pattern) {
    return new RegExp("^" + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').trim() + "$");
}

function includeFile(file) {
    if (includes) {
        for (var i = 0; i < includes.length; i++) {
            if (includes[i].test(file))
                return true;
        }
        return false;      
    }
    else {
        for (var i = 0; i < excludes.length; i++) {
            if (excludes[i].test(file))
                return false;
        }
        return true;
    }
}

function replacizeFile(file) {
  fs.lstat(file, function(err, stats) {
      if (err) throw err;

      if (stats.isSymbolicLink()) {
          // don't follow symbolic links for now
          return;
      }
      if (stats.isFile()) {
          if (!includeFile(file)) {
              return;
          }     
          fs.readFile(file, "utf-8", function(err, text) {
              if (err) {
                  if (err.code == 'EMFILE') {
                      console.log('Too many files, try running `replace --synchronous`');
                      process.exit(1);
                  }
                  throw err;
              }

              text = replacizeText(text, file);             
              if(canReplace) {
                  fs.writeFile(file, text, function(err) {
                      if (err) throw err;
                  });
              }
          });
      }
      else if (stats.isDirectory() && options.recursive) {
          fs.readdir(file, function(err, files) {
              if (err) throw err;
              for (var i = 0; i < files.length; i++) {
                  replacizeFile(path.join(file, files[i]));                      
              }
          });
      }
   });
}

function replacizeFileSync(file) {
  var stats = fs.lstatSync(file);
  if (stats.isSymbolicLink()) {
      // don't follow symbolic links for now
      return;
  }
  if (stats.isFile()) {
      if (!includeFile(file)) {
          return;
      }   
      var text = fs.readFileSync(file, "utf-8");

      text = replacizeText(text, file);
      if (canReplace) {
          fs.writeFileSync(file, text);
      }
  }
  else if (stats.isDirectory() && options.recursive) {
      var files = fs.readdirSync(file);
      for (var i = 0; i < files.length; i++) {
          replacizeFileSync(path.join(file, files[i]));                      
      }
  }
}

function replacizeText(text, file) {
    if (!regex.test(text)) {
        return text;
    }

    if (!options.silent) {
        console.log("\t" + file);
    }
    if (!options.silent && !options.quiet) {
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (regex.test(line)) {
                if (!canReplace && ++count > options.count) {
                    process.exit(0);
                }
                var replacement = options.replacement || "$&";
                line = line.replace(regex, replacement[options.color]);
                console.log("\t\t" + (i + 1) + ": " + line.slice(0, limit));
            }
        }
    }
    if (canReplace) {
        return text.replace(regex, options.replacement);
    }
}
