const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const {useCache} = require('./utils');
const getCountryName = require('country-list').getName;
const fs = require('fs-extra');
const path = require('path');

async function main() {
  console.log(`${__filename} started.`);

  const context = await fs.readJson(path.join(__dirname, '../context.json'));
  const originalContext = JSON.parse(JSON.stringify(context['@context']));

// Create a GraphQL-LD client based on a client-side Comunica engine
  const client = new Client({context, queryEngine});

  let countries = [];

  // Get all.html events that have at least one battle and have a location.
  let query = `
  query { 
    location @single
    hasBattle @single
  }`;

  const events = (await client.query({query})).data;

  events.forEach(event => {
    if (event.location !== '' && countries.indexOf(event.location) === -1) {
      countries.push(event.location);
    }
  });

  // Get all.html winners that have at least one win and have a location
  query = `
  query { 
    country @single
    wins 
  }`;

  const winners = (await client.query({query})).data;

  winners.forEach(winner => {
    if (winner.country !== '' && countries.indexOf(winner.country) === -1) {
      countries.push(winner.country);
    }
  });

  countries.sort();

  console.log(`${__filename} done.`);

  return countries.map(country => {
   return {
     code: country,
     name: getCountryName(country)
    }
  });
}

module.exports = useCache(main, 'countries.json');