#!/usr/bin/env ruby

expected="  test/a/c.txt
     3: xxxxxx
     4: xxxxxx
  test/a/d.py
     6: xxx
  test/a.txt
     3: xxxx
     4: xxxx\n"

# color removal trick from http://is.gd/0jdOOn
actual=`./bin/search.js -r 'xx' test`.gsub(/\e\[(\d+)m/, '')

if actual == expected
  puts '`./bin/search.js -r "xx" test` ... PASS!'
else
  puts '`./bin/search.js -r "xx" test` ... FAIL :('
end
