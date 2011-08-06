#!/usr/bin/env node

var path = require("path"),
    nomnom = require("nomnom"),
    replace = require("../replace");

var options = nomnom.opts({
    regex: {
        position: 0,
        help: "JavaScript regex for searching file e.g. '\\d+'",
        required: true
    },
    replacement: {
        position: 1,
        help: "Replacement string for matches",
        required: true
    },
    path: {
        position: 2,
        help: "File or directory to search (default is '.')",
        list: true,
        default: ["."]
    },
    recursive: {
        abbr: 'r',
        help: "Recursively search and replace in directories"
    },
    preview: {
        abbr: 'p',
        help: "Preview the replacements, but don't modify files"
    },
    ignoreCase: {
        abbr: 'i',
        full: 'ignore-case',
        help: "Ignore case when matching"
    },
    multiline: {
        abbr: 'm',
        flag: true,
        help: "Match line by line, default is true",
        default: true
    },
    funcFile: {
        abbr: 'f',
        full: 'function-file',
        metavar: 'PATH',
        help: 'file containing JS replacement function'
    },
    include: {
        metavar: 'PATHS',
        help: "Only search in these files, e.g. '*.js,*.foo'"
    },
    exclude: {
        metavar: 'PATHS',
        help: "Don't search in these files, e.g. '*.min.js'"
    },
    excludeList: {
        full: 'exclude-list',
        metavar: 'FILE',
        help: "File containing a new-line separated list of files to ignore",
        default: path.join(__dirname, "..", "defaultignore"),
        hidden: true
    },
    maxLines: {
        string: '-n NUMLINES',
        help: 'limit the number of lines to preview'
    },
    count: {
        abbr: 'c',
        help: 'display count of occurances in each file'
    },
    quiet: {
        abbr: 'q',
        help: "Just print the names of the files matches occured in (faster)"
    },
    silent: {
        abbr: 's',
        help: "Don't print out anything"
    },
    color: {
        metavar: 'COLOR',
        help: "highlight color, e.g. 'green', 'blue', 'bold'",
        default: 'cyan'
    },
    async: {
        abbr: 'a',
        help: "asynchronously read/write files in directory (faster)"
    }
  })
  .scriptName("replace")
  .parseArgs();

replace(options);
