#!/bin/bash
# Original code from https://github.com/nizarmah/auto-minify/blob/master/entrypoint.sh

in_dir=./src
out_dir=./dist

# https://esbuild.github.io/getting-started/#download-a-build
esbuild_system=esbuild-linux-64
esbuild_version=0.13.3
esbuild=$esbuild_system-$esbuild_version
esbuild_bin=./package/bin/esbuild
esbuild_options="--bundle --minify"

find_files () {
	# find all js and css files in in_dir

	find $in_dir \( -name "*.js" -o -name "*.css" \) -type f
}

minify_file () {
	# arguments:
	# 	1- input file
	# minify a file from in_dir/... to out_dir/...

	file=$1
	out=${file/${in_dir}/${out_dir}}

	# create output directories if they don't exist
	mkdir -p $(dirname $out)

	$esbuild_bin $file $esbuild_options --format=esm --outfile=$out

	[[ $file == *.css ]] && return

	node=${file/${in_dir}/"${out_dir}/node"}

	mkdir -p $(dirname $node)

	$esbuild_bin $file $esbuild_options --format=cjs --platform=node --outfile=$node
	sed -i 's/import(/require(/g' $node
}

[ ! -f $esbuild.tgz ] && curl -O https://registry.npmjs.org/$esbuild_system/-/$esbuild.tgz
[ ! -f $esbuild_bin ] && tar xf ./$esbuild.tgz

set -e

rm -rf $out_dir

for file in $(find_files); do
	minify_file $file &
done

wait
