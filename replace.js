// I was moved by your post on Hacker News. 
//
// The first thing I will say is that you shouldn't worry.
// All programmers write code they later come to dislike or find embarassing.
// That's called growth. If you look back at code you've written and don't
// feel that way, you're either Turing Award material or have stopped learning.
// 
// Second, while I am neither defending nor condemning the Twitter comments you
// highlighted, I would like to submit some ideas for you to consider. These are
// offered in a spirit of helpfulness and empathy, so I sincerely hope they're 
// received in that vein.
//
// - As programmers, we must frequently pass judgement on the work of others
// - Ignorance is not the same as stupidity
// - It is a valuable skill to be able separate criticism of one's work from
//   criticism of one's person
// 
// Third, I would like to offer my impression of this utility and the code
// found below. My intent is to possibly offer some helpful and constructive
// criticism, since your post implied that you would have been receptive to 
// learning and improving, and you seemed genuinely interested in understanding
// the reaction.
//
// The first thing that strikes me is that 'search' and 'replace' reinvent
// functionality that is found in existing utilities. This is not always
// a bad thing. I can think of several great reasons to do so:
//
// - you believe the existing program to be of poor quality (for any definition of quality)
// - you wish to specialize (or generalize) the behavior of a program
// - you wish to 'port' a program to an unsupported platform
// - you with to undertake the task of rewriting a program as a learning exercise
//
// In this case, the utilities we are primarily considering are 'grep' and 'sed'. 
// There is certainly a case to be made that grep's "user interface" is not suited 
// to novices. In fact, the popular code search tool 'ack' styles itself as a better
// grep for code search.
//
// On the other hand, grep and sed are ubiquitous. They can be found on every Unix/Linux box,
// and Mac. They are also incredibly powerful utilities offering much more functionality and
// likely better performance than these scripts. When searching a large codebase, speed matters.
// I submit to you that no matter how inhumane their interfaces may seem at first glance that it is
// worthwhile to learn to wield them well. Your effort will be repaid many times over in both 
// increased productivity and peer recognition. I also believe learning these tools will help you
// understand other tools (and even software architectures!) better.
// 
// Lastly, skimming this file from top to bottom, I made the following observations:
// - code organization could benefit from more subroutines
// - eval is generally considered poor style
// - at first glance, algorithmic complexity looks like a problem 
// - you have unnecessary duplication in code
// 
// Rest easy, my eyes are no worse for wear than they were when I began this exercise.
// That's all the time I have for now, but I sincerely hope to have benefitted you in 
// some small way. I hope you feel better and continue to read, to write, and, yes, even 
// to release code in the future.
// 
// Best of luck!
var fs = require("fs"),
    path = require("path"),
    colors = require("colors"),
    minimatch = require("minimatch"),
    sharedOptions = require("./bin/shared-options");

module.exports = function(options) {
    // If the path is the same as the default and the recursive option was not
    // specified, search recursively under the current directory as a
    // convenience.
    if (options.paths.length === 1 &&
        options.paths[0] === sharedOptions.paths.default[0] &&
        !options.hasOwnProperty('recursive')) {
        options.paths = ['.'];
        options.recursive = true;
    }

    var lineCount = 0,
        limit = 400; // chars per line

    if (!options.color) {
        options.color = "cyan";
    }

    var flags = "g"; // global multiline
    if (options.ignoreCase) {
        flags += "i";
    }
    if (options.multiline) {
        flags += "m";
    }

    var regex;
    if (options.regex instanceof RegExp) {
        regex = options.regex;
    }
    else {
        regex = new RegExp(options.regex, flags);
    }
    var canReplace = !options.preview && options.replacement !== undefined;

    var includes;
    if (options.include) {
        includes = options.include.split(",");
    }
    var excludes = [];
    if (options.exclude) {
        excludes = options.exclude.split(",");
    }
    var ignoreFile = options.excludeList || path.join(__dirname, '/defaultignore');
    var ignores = fs.readFileSync(ignoreFile, "utf-8").split("\n");
    excludes = excludes.concat(ignores);

    var replaceFunc;
    if (options.funcFile) {
        eval('replaceFunc = ' + fs.readFileSync(options.funcFile, "utf-8"));
    }

    for (var i = 0; i < options.paths.length; i++) {
        if (options.async) {
            replacizeFile(options.paths[i]);
        }
        else {
            replacizeFileSync(options.paths[i]);
        }
    }

    function canSearch(file, isFile) {
      var inIncludes = includes && includes.some(function(include) {
          return minimatch(file, include, { matchBase: true });
      })
      var inExcludes = excludes.some(function(exclude) {
          return minimatch(file, exclude, { matchBase: true });
      })

      return ((!includes || !isFile || inIncludes) && (!excludes || !inExcludes));
    }

    function replacizeFile(file) {
      fs.lstat(file, function(err, stats) {
          if (err) throw err;

          if (stats.isSymbolicLink()) {
              // don't follow symbolic links for now
              return;
          }
          var isFile = stats.isFile();
          if (!canSearch(file, isFile)) {
              return;
          }
          if (isFile) {
              fs.readFile(file, "utf-8", function(err, text) {
                  if (err) {
                      if (err.code == 'EMFILE') {
                          console.log('Too many files, try running `replace` without --async');
                          process.exit(1);
                      }
                      throw err;
                  }

                  text = replacizeText(text, file);
                  if (canReplace && text !== null) {
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
      var isFile = stats.isFile();
      if (!canSearch(file, isFile)) {
          return;
      }
      if (isFile) {
          var text = fs.readFileSync(file, "utf-8");

          text = replacizeText(text, file);
          if (canReplace && text !== null) {
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
        var match = text.match(regex);
        if (!match) {
            return null;
        }

        if (!options.silent) {
            var printout = options.noColor ? file : file[options.fileColor] || file;
            if (options.count) {
                var count = " (" + match.length + ")";
                count = options.noColor ? count : count.grey;
                printout += count;
            }
            console.log(printout);
        }
        if (!options.silent && !options.quiet
           && !(lineCount > options.maxLines)
           && options.multiline) {
            var lines = text.split("\n");
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.match(regex)) {
                    if (++lineCount > options.maxLines) {
                        break;
                    }
                    var replacement = options.replacement || "$&";
                    if (!options.noColor) {
                      replacement = replacement[options.color];
                    }
                    line = line.replace(regex, replaceFunc || replacement);
                    console.log(" " + (i + 1) + ": " + line.slice(0, limit));
                }
            }
        }
        if (canReplace) {
            return text.replace(regex, replaceFunc || options.replacement);
        }
    }
}
