var fs = require("fs"),
    path = require("path"),
    readline = require("readline"),
    colors = require("colors"),
    async = require("async");

var excludes = [],
    includes,
    regex,
    flags = "gm", // global multiline
    canReplace,
    count = 0,
    options;

var prompt = readline.createInterface(process.stdin, process.stdout);

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
              if (err) throw err;

              replacizeText(text, file, function(replaced) {;             
                  if(canReplace) {
                      fs.writeFile(file, replaced, function(err) {
                          if (err) throw err;
                      });
                  }
              });
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

      replacizeText(text, file, function(replaced) {;             
          if(canReplace) {
              fs.writeFileSync(file, replaced);
          }
      });
  }
  else if (stats.isDirectory() && options.recursive) {
      var files = fs.readdirSync(file);
      for (var i = 0; i < files.length; i++) {
          replacizeFileSync(path.join(file, files[i]));                      
      }
  }
}

function replacizeText(text, file, callback) {
    if (!regex.test(text)) {
        callback(text);
    }

    if (!options.silent) {
        console.log("\t" + file);
    }
    if (!options.silent && !options.quiet) {
        replaceLines(text.split("\n"), callback);
    }
    else if (canReplace) {
        callback(text.replace(regex, options.replacement));
    }
}

function replaceLines(lines, callback) {
    var lineNo = 0;

    function replaceLine(line, next) {
        lineNo++;
        if (!regex.test(line)) {
            return next();
        }
        if (!canReplace && ++count > options.count) {
            process.exit(0);
        }
        
        var replacement = options.replacement || "$&";
        line = line.replace(regex, replacement[options.color]);     
        process.stdout.write("\t\t" + (lineNo + 1) + ": " + line);

        if (options.prompt) {
            prompt.question("replace?", function(answer) {
                if (answer == "y") {
                    lines[lineNo] = line.replace(regex, options.replacement);
                }
                else if (answer == "n") {
                    console.log("skipped");                
                }
                next();
            });
        }
        else {
            process.stdout.write("\n"); // prompt adds newline
            lines[lineNo] = line.replace(regex, options.replacement);
            next();
        }
    }

    async.forEachSeries(lines, replaceLine, function (err) {
        if (err) throw err;
        callback(lines.join("\n"));
    });
}
