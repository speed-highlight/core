#!/bin/bash -l
# Original code from https://github.com/nizarmah/auto-minify/blob/master/entrypoint.sh

INPUT_DIRECTORY=src
INPUT_OUTPUT=dist
INPUT_OVERWRITE=true

find_files () {
	: '
	find all js and css files in_dir
		- `find` returns the relative path, which is needed
		- `*` acts as a recursive operator
	Piped into grep to get all non minified files
	So, when appended to the command parameters, no error is caused
	'

	find $in_dir -name "*.js" -o -name "*.css" -type f
}

exec_minify_cmd () {
	: '
	arguments:
		1- input file
		2- output file
	returns the command needed to minify the file
	depending on what type the file is (its extension)
	'
	file=$1
	out=$2

	if [[ $file == *.js ]]; then
		npx uglifyjs $file --compress --mangle --output $out
	elif [[ $file == *.css ]]; then
		npx cleancss -o $out $file
	fi
}

minify_file () {
	: '
	arguments:
		1- input file
	checks the file type (whether css or js)
	then creates the output file of that file
	then minifies the file with a specific command
	then checks if the command returned an error
	if it did, program exits with that error code
	'
	file=$( $1 )
	out=${file/${in_dir}/${out_dir}}

	echo "Minify : $file -> $out"

	exec_minify_cmd $file $out
}

cd /github/workspace

in_dir="./$INPUT_DIRECTORY"

out_dir="./$INPUT_OUTPUT"

if [ ! -z $out_dir ]; then
	# create output directories if they don't exist
	mkdir -p $out_dir
fi

overwrite=false
if [ "${INPUT_OVERWRITE,,}" == "true" ]; then
	overwrite=true
fi

file_set=find_files

set -e

for file in $file_set; do
	minify_file $file
done