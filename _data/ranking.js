const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const {format} = require('date-fns');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {createNameForBattle, useCache} = require('./utils');

// Define a JSON-LD context
const context = {
  "@context": {
    "type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "schema": "http://schema.org/",
    "items": "schema:itemListElement",
    "dancer": "schema:item",
    "position": "schema:position",
    "name": "schema:name",
    "country": "https://dancebattle.org/ontology/representsCountry",
    "points": "https://dancehallbattle.org/ontology/points",
    "RANKING": "https://dancehallbattle.org/ontology/Ranking"
  }
};

const originalContext = JSON.parse(JSON.stringify(context['@context']));

// Create a GraphQL-LD client based on a client-side Comunica engine
const client = new Client({context, queryEngine});

async function main() {

// Define a query
  const query = `
  query { 
    id @single
    type(_:RANKING)
    type
    items {
      dancer @single {
        id @single
        name @single
        country @single
      }
      position @single
      points @single
    }
  }`;

  // Execute the query
  let rankings = (await client.query({query})).data;
  console.log(rankings);
  const countryHomeAwayRanking = getCountryHomeAway(rankings);
  const countryHomeAwayMap = restructure(countryHomeAwayRanking);
  const ranks = Object.keys(countryHomeAwayMap);

  console.log(countryHomeAwayMap);
  console.log(ranks.join(' '));

  return {
    countryHomeAway: {
      map: countryHomeAwayMap,
      ranks: Object.keys(countryHomeAwayMap)
    }
  };
}

function getCountryHomeAway(rankings) {
  let i = 0;

  while (i < rankings.length &&
  rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') === -1 &&
  rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/HomeRanking') !== -1 &&
  rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/AwayRanking') !== -1) {
    i ++;
  }

  return rankings[i];
}

function restructure(ranking) {
  const map = {};

  ranking.items.forEach(spot => {
    if (!map[spot.position]) {
      map[spot.position] = [];
    }

    map[spot.position].push(spot);
  });

  return map;
}


module.exports = useCache(main, 'rankings.json');