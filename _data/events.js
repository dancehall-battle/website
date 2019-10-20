const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const getCountryName = require('country-list').getName;
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {createNameForBattle, useCache, parseDates} = require('./utils');

async function main() {
  return await require('./_events');
}