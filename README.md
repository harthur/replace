# replace
`replace` is a command-line utility for performing search-and-replace on files. It's similar to sed but there are a few differences:

* Modifies files when matches are found
* Recursive search on directories with -r
* Uses [JavaScript syntax](https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions#Using_Simple_Patterns) for regular expressions.
* Asynchronous, but still slower than grep.

# Install
With [node.js](http://nodejs.org/) and [npm](http://github.com/isaacs/npm):

	npm install replace -g


## Examples

Replace all occurrences of "var" with "let" in files in the current directory:

```
replace 'var' 'let' *
```

Replace in all files in a recursive search of the current directory:

```
replace 'var' 'let' . -r
```

Replace only in test/file1.js and test/file2.js:

```
replace 'var' 'let' test/file1.js test/file2.js
```

Replace all word pairs with "_" in middle with a "-":

```
replace '(\w+)_(\w+)' '$1-$2' *
```

Replace only in files with names matching *.js:

```
replace 'var' 'let' . -r --include="*.js"
```

Don't replace in files with names matching *.min.js and *.py:

```
replace 'var' 'let' . -r --exclude="*.min.js,*.py"
```

Preview the replacements without modifying any files:

```
replace 'var' 'let' . -r --dry-run
```

See all the options:

```
replace -h
```

# More Details

### Search
There's also a `search` command. It's like `grep`, but with `replace`'s syntax, and slower!

```
search "setTimeout" . -r
```

### Excludes
By default, `replace` and `search` will exclude files (binaries, images, etc) that match patterns in the `"defaultignore"` located in this directory.

### On huge directories
`replace` will sputter on recursive searches of enormous directories. This ain't C. If `replace` is taking too long, try turning on the quiet flag with `-q` or only including the necessary file types with `--include`.

If there are too many files in the directory, node will throw a `EMFILE, Too many open files`. Check your command line then try a synchronous search with `--synchronous`

