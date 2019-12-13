#!/usr/bin/env bash

rm -rf _site
echo "Building core..."
./build-core.sh
echo "Building core done."

echo "Building dancer..."
./build-dancer.sh
echo "Building dancer done."

echo "Building ranking..."
./build-ranking.sh
echo "Building ranking done."