var fs = require("fs"),
    test = require('tape'),
    replace = require('replace');

function getText(file) {
  var content = fs.readFileSync(file, "utf-8");
  return content;
}

test('basic', function (t) {
  t.plan(2);

  var file = "./test_files/test_basic.txt";

  replace({
    regex: "a",
    replacement: "b",
    path:[file]
  });

  var expected = "bbbccc";
  t.equal(getText(file), expected, "single letter replace works");

  replace({
    regex: "b",
    replacement: "a",
    path:[file]
  });

  var expected = "aaaccc";
  t.equal(getText(file), expected, "reverting worked");
});


test('multiline', function(t) {
  t.plan(3);

  var file = "./test_files/test_multiline.txt";

  replace({
    regex: "c$",
    replacement: "t",
    path:[file],
    multiline: false
  });

  var expected = "abc\ndef";
  t.equal(getText(file), expected, "$ shouldn't match without multiline");

  replace({
    regex: "c$",
    replacement: "t",
    path:[file],
    multiline: true
  });

  var expected = "abt\ndef";
  t.equal(getText(file), expected, "with multiline, $ should match eol");

  replace({
    regex: "t$",
    replacement: "c",
    path:[file],
    multiline: true
  });

  var expected = "abc\ndef";
  t.equal(getText(file), expected, "reverting worked");
});

test('case insensitive', function(t) {
  t.plan(2);

  var file = "./test_files/test_case.txt";

  replace({
    regex: "a",
    replacement: "c",
    path:[file],
    ignoreCase: true
  });

  var expected = "cccc";
  t.equal(getText(file), expected, "case insensitive replace");

  replace({
    regex: "c",
    replacement: "A",
    path:[file]
  });

  var expected = "AAAA";
  t.equal(getText(file), expected, "reverting worked");
})

test('preview', function(t) {
  t.plan(1);

  var file = "./test_files/test_preview.txt";

  replace({
    regex: "a",
    replacement: "c",
    path:[file],
    preview: true
  });

  var expected = "aaaa";
  t.equal(getText(file), expected, "no replacement if 'preview' is true");
})
