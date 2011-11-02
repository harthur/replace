#!/usr/bin/env node

var path = require("path"),
    nomnom = require("nomnom"),
    replace = require("../replace");

var options = nomnom.options({
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
        flag: true,
        help: "Recursively search and replace in directories"
    },
    preview: {
        abbr: 'p',
        flag: true,
        help: "Preview the replacements, but don't modify files"
    },
    ignoreCase: {
        abbr: 'i',
        full: 'ignore-case',
        flag: true,
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
        string: '--include=PATHS',
        help: "Only search in these files, e.g. '*.js,*.foo'"
    },
    exclude: {
        string: '--exclude=PATHS',
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
        flag: true,
        help: 'display count of occurances in each file'
    },
    quiet: {
        abbr: 'q',
        flag: true,
        help: "Just print the names of the files matches occured in (faster)"
    },
    silent: {
        abbr: 's',
        flag: true,
        help: "Don't print out anything"
    },
    color: {
        metavar: 'COLOR',
        help: "highlight color, e.g. 'green' or 'blue'",
        choices: ['red', 'green', 'blue', 'cyan', 'yellow', 'magenta', 'bold', 'italic'],
        default: 'cyan'
    },
    async: {
        abbr: 'a',
        flag: true,
        help: "asynchronously read/write files in directory (faster)"
    }
  })
  .script("replace")
  .parse();

replace(options);
