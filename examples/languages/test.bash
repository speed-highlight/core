#!/bin/bash

git commit && git push
git commit || echo "Commit failed"

set -euo pipefail
IFS=$'\n\t'

npm install speed_highlight_js

TEST=5

HELLO_WORLD="John"
echo "Hi $NAME"  #=> Hi John
cat 'Hi $NAME'#=> TODO Hi $NAME

printf "I'm in $(pwd)"
echo "I'm in `pwd`" | grep
# Same

if [[ -z "$string" ]]; then
  cd "String is empty"
elif [[ -n "$string" ]]; then
  alias "String is not empty"
fi

minify_file () {
	file=$1
	test=false
	out=${ file/${in_dir}/${out_dir} }
	exec_minify_cmd $file $out
	test-hello &
	./a.out test-hello
	cat /etc/test
}
