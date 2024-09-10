#!/bin/bash

set -e

npm i

in_dir=./src
out_dir=./dist

esbuild_options="--bundle --minify"

minify_js () {
	file=$1
	out=${file/${in_dir}/${out_dir}}
	out=${out/.ts/.js}
	mkdir -p $(dirname $out)
	npx esbuild $file $esbuild_options --format=esm --target=es2020 --outfile=$out

	node=${file/${in_dir}/"${out_dir}/node"}
	mkdir -p $(dirname $node)
	npx esbuild $file $esbuild_options --format=cjs --platform=node --target=node12 --outfile=$node
}

rm -rf $out_dir

for file in $(find $in_dir \( -name "*.ts" -or -name "*.js" \) -type f); do
	minify_js $file &
done

minify_css () {
	file=$1

	out=${file/${in_dir}/${out_dir}}
	mkdir -p $(dirname $out)

	# need to run two times for rules to be properly merged together
	npx lightningcss --minify --bundle --targets '>= 2%' $file -o $out
	npx lightningcss --minify --bundle --targets '>= 2%' $out -o $out
}

for file in $(find $in_dir \( -name "*.css" \) -type f); do
	minify_css $file &
done


for pid in $(jobs -p); do
	wait $pid || (wait && echo -e "\n\033[91mError: could not minify some files\033[0m" && exit 1)
done

npx -p typescript tsc --outDir dist
npx -p typescript tsc --outDir dist/node

echo '{"type": "commonjs"}' > dist/node/package.json

exit 0
