#!/bin/bash
# Original code from https://github.com/nizarmah/auto-minify/blob/master/entrypoint.sh

in_dir=src
out_dir=dist

find_files () {
	# find all changed js and css files in in_dir

	diff=$(git diff --name-only HEAD~1..HEAD)

	for file in $diff; do
		if [[ $file == $in_dir/*js ]] || [[ $file == $in_dir/*css ]]; then
			echo "file: $file"
		fi
	done
}

exec_minify_cmd () {
	# arguments:
	# 	1- input file
	# 	2- output file
	# minify the file depending on the file extension

	file=$1
	out=$2

	# create output directories if they don't exist
	mkdir -p $(dirname $out)

	if [[ $file == *.js ]]; then
		npx uglifyjs $file -c -m toplevel=true --mangle-props regex=/_$/ --output $out
	elif [[ $file == *.css ]]; then
		npx cleancss -o $out $file
	fi
}

minify_file () {
	# arguments:
	# 	1- input file
	# minify a file from in_dir/... to out_dir/...

	file=$1
	out=${file/${in_dir}/${out_dir}}

	echo "Minify : $file -> $out"

	exec_minify_cmd $file $out
}

set -e

for file in $(find_files); do
	minify_file $file
done
