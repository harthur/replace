# niftylettuce-replace <sup>0.2.0</sup>

This is an updated fork of the repo for the original `replace` npm package.

**Please use:** `$ npm install -g niftylettuce-replace`

`$ replace` is a command line utility for performing search-and-replace on files. It's similar to sed but there are a few differences:

* Modifies files when matches are found
* Recursive search on directories with -r
* Uses [JavaScript syntax](https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions#Using_Simple_Patterns) for regular expressions and [replacement strings](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter).

# Quick Start

```
npm install -g niftylettuce-replace
```

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
replace 'var' 'let' . -r --preview
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
If `replace` is taking too long on a large directory, try turning on the quiet flag with `-q`, only including the necessary file types with `--include` or limiting the lines shown in a preview with `-n`.


### What it looks like
![replace](http://i.imgur.com/qmJjS.png)

