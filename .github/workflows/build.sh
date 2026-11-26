#!/bin/bash

set -e

# run through `npm run build`, after an install: the tools below are the
# ones of the lockfile, from node_modules/.bin

in_dir=./src
out_dir=./dist

esbuild_options="--bundle --minify --external:./languages/* --external:./themes/*  --external:./index.js"

minify_js () {
	file=$1
	opts="$esbuild_options"
	case $file in
		# the barrel must stay a re-export file (its imports are written
		# ./asm.js so the global externals do not match them), inlining it
		# would destroy the module graph consumers tree-shake on
		*/languages/index.js) opts="$esbuild_options --external:./*" ;;
	esac
	out=${file/${in_dir}/${out_dir}}
	out=${out/.ts/.js}
	mkdir -p $(dirname $out)
	esbuild $file $opts --format=esm --target=es2020 --outfile=$out

	node=${file/${in_dir}/"${out_dir}/node"}
	mkdir -p $(dirname $node)
	esbuild $file $opts --format=cjs --platform=node --target=node12 --outfile=$node
}

rm -rf $out_dir

# src/aliases.js is bundled into the core, it must be current before esbuild
node scripts/generate-aliases.js

for file in $(find $in_dir \( -name "*.ts" -or -name "*.js" \) -type f); do
	minify_js $file &
done

minify_css () {
	file=$1

	out=${file/${in_dir}/${out_dir}}
	mkdir -p $(dirname $out)

	# need to run two times for rules to be properly merged together
	lightningcss --minify --bundle --targets '>= 2%' $file -o $out
	lightningcss --minify --bundle --targets '>= 2%' $out -o $out
}

for file in $(find $in_dir \( -name "*.css" \) -type f); do
	minify_css $file &
done


for pid in $(jobs -p); do
	wait $pid || (wait && echo -e "\n\033[91mError: could not minify some files\033[0m" && exit 1)
done

tsc --outDir dist
tsc --outDir dist/node

echo '{"type": "commonjs"}' > dist/node/package.json

node scripts/generate-tables.js
node scripts/generate-toc.js

exit 0
