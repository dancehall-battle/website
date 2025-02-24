#!/usr/bin/env bash

mode=$1

rm -rf _site
cp config.json _data
MODE=$mode node ./node_modules/@11ty/eleventy/cmd.js
