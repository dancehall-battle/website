#!/usr/bin/env bash

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
  rm -rf _cache
  exit 0
}

# Remove old folders
rm -rf _cache # Should already be removed, but just in case
rm -rf _site

# Create needed folders
mkdir _cache

ELEVENTY_SERVE=true DEBUG=Eleventy* node ./node_modules/@11ty/eleventy/cmd.js --serve --port 8080
