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
        help: "File (or directory when using -r) to search",
        list: true,
        required: true
    },
    recursive: {
        string: '-r, --recursive',
        help: "Recursively search and replace in directories"
    },
    dryRun: {
        string: '-d, --dry-run',
        help: "See which occurances will be replaced, but don't modify files"
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
        string: '--exclude-list=FILE',
        help: "File containing a new-line separated list of files to ignore",
        default: path.join(__dirname, "..", "defaultignore")
    },
    quiet: {
        string: '-q, --quiet',
        help: "Just print the names of the files matches occured in (faster)"
    },
    silent: {
        string: '-s, --silent',
        help: "Don't print out anything"
    },
    color: {
        string: '-c COLOR, --color=COLOR',
        help: "highlight color, e.g. 'green', 'blue', 'bold'",
        default: 'cyan'
    },
    synchronous: {
        string: '--synchronous',
        hidden: true
    }
  })
  .scriptName("replace")
  .parseArgs();

replace(options);
