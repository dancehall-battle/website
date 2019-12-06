#!/usr/bin/env bash

# rm -rf _site
rm -rf _data
cp -R _data-core _data
cd core-config
cp ../.eleventy.js .eleventy.js
cp .eleventyignore ../.eleventyignore
../node_modules/@11ty/eleventy/cmd.js
rm -rf eleventy.js
rm -rf ../_data
rm -rf ../.eleventyignore