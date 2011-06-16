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
    path: {
        position: 1,
        help: "File or directory to search (default is '.')",
        list: true,
        default: ["."]
    },
    recursive: {
        string: '-r, --recursive',
        help: "Recursively search directories"
    },
    ignoreCase: {
        string: '-i, --ignore-case',
        help: "Ignore case when searching"
    },
    include: {
        string: '--include=PATHS',
        help: "Only search in these files, e.g. '*.js,*.foo'"
    },
    exclude: {
        string: '--exclude=PATHS',
        help: "Don't search in these files, e.g. 'test*,*.min.js'"
    },
    excludeList: {
        string: '--exclude-list=FILE',
        help: "File containing a new-line separated list of files to ignore",
        default: path.join(__dirname, "..", "defaultignore"),
        hidden: true
    },
    maxLines: {
        string: '-n NUMLINES',
        help: 'limit the number of lines to preview'
    },
    count: {
        string: '-c, --count',
        help: 'display count of occurances in each file'
    },
    quiet: {
        string: '-q, --quiet',
        help: "Just print the names of the files matches occured in (faster)"
    },
    color: {
        string: '--color=COLOR',
        help: "highlight color, e.g. 'green', 'blue', 'bold'",
        default: 'cyan'
    },
    async: {
        string: '-a, --async',
        help: "asynchronously read/write files in directory (faster)"
    }
  })
  .scriptName("search")
  .parseArgs();

replace(options);
