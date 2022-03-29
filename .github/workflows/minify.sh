#!/bin/sh

in_dir=./src
out_dir=./dist

esbuild_system=esbuild-linux-64
[ "$(uname)" == "Darwin" ] && esbuild_system=esbuild-darwin-64

esbuild_version=0.14.28
esbuild=$esbuild_system-$esbuild_version
esbuild_bin=./package/bin/esbuild
esbuild_options="--bundle --minify"

minify_file () {
	# arguments:
	# 	1- input file
	# minify a file from in_dir/... to out_dir/...

	set -e

	file=$1
	out=${file/${in_dir}/${out_dir}}
	mkdir -p $(dirname $out)
	$esbuild_bin $file $esbuild_options --format=esm --target=es2019 --outfile=$out

	[[ $file == *.css ]] && return
	node=${file/${in_dir}/"${out_dir}/node"}
	mkdir -p $(dirname $node)
	$esbuild_bin $file $esbuild_options --format=cjs --platform=node --target=node12 --outfile=$node
}

[ ! -f $esbuild.tgz ] && curl -O https://registry.npmjs.org/$esbuild_system/-/$esbuild.tgz
[ ! -f $esbuild_bin ] && tar xf ./$esbuild.tgz

rm -rf $out_dir

for file in $(find $in_dir \( -name "*.js" -o -name "*.css" \) -type f); do
	minify_file $file &
done

for pid in $(jobs -p); do
	wait $pid || (wait && echo -e "\n\033[91mError: could not minify some files\033[0m" && exit 1)
done

exit 0