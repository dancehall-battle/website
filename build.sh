#!/usr/bin/env bash

mode=$1

rm -rf _site
MODE=$mode node ./node_modules/@11ty/eleventy/cmd.js