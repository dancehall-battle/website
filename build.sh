#!/usr/bin/env bash

mode=$1

rm -rf _site
echo "Building core..."
./build-core.sh $mode
echo "Building core done."

echo "Building dancer..."
./build-dancer.sh $mode
echo "Building dancer done."

echo "Building ranking..."
./build-ranking.sh $mode
echo "Building ranking done."