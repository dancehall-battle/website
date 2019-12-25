#!/usr/bin/env bash

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
  rm -rf _cache
  rm -rf _data
  rm -f .eleventyignore
  exit 0
}

# Remove old folders
rm -rf _cache # Should already be removed, but just in case
rm -rf _site
rm -rf _data

# Create needed folders
mkdir _cache
mkdir _data
cp -R _data-core/* _data
cp -R _data-dancer/* _data
cp -R _data-ranking/* _data
cp .eleventyignore.serve .eleventyignore

envVars="ELEVENTY_SERVE=true SKIP=upcoming.json,battles.json,countries.json,dancer-list.json,dancers.json,events.json,country-to-battles-per-year.json,country-to-events.json,rankings.json MODE=dev"
#envVars="ELEVENTY_SERVE=true"

if [ "$1" == "-v" ]; then
    envVars="$envVars DEBUG=Eleventy*"
fi

eval $envVars node ./node_modules/@11ty/eleventy/cmd.js --serve --port 8080 --input=. --output=_site