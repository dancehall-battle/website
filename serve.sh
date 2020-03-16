#!/usr/bin/env bash

# Remove old folders
rm -rf _site

envVars="ELEVENTY_SERVE=true ELEVENTY_PORT=8080"
#envVars="ELEVENTY_SERVE=true ELEVENTY_PORT=8080"

if [ "$1" == "-v" ]; then
    envVars="$envVars DEBUG=Eleventy*"
fi

eval $envVars node ./node_modules/@11ty/eleventy/cmd.js --serve --port 8080 --input=. --output=_site