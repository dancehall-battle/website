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

envVars="ELEVENTY_SERVE=true SKIP=upcoming.json,battles.json,countries.json,dancer-list.json,dancers.json,events.json,country-to-battles-per-year.json,country-to-events.json"

if [ "$1" == "-v" ]; then
    envVars="$envVars DEBUG=Eleventy*"
fi

eval $envVars node ./node_modules/@11ty/eleventy/cmd.js --serve --port 8080
