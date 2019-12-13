const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const {useCache} = require('./utils');
const getCountryName = require('country-list').getName;

// Define a JSON-LD context
const context = {
  "@context": {
    "type": {"@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},
    "label": {"@id": "http://www.w3.org/2000/01/rdf-schema#label"},
    "name": {"@id": "http://schema.org/name"},
    "start": {"@id": "http://schema.org/startDate"},
    "end": {"@id": "http://schema.org/endDate"},
    "location": {"@id": "http://schema.org/location"},
    "hasWinner": {"@id": "https://dancebattle.org/ontology/hasWinner"},
    "wins": {"@reverse": "https://dancebattle.org/ontology/hasWinner"},
    "level": {"@id": "https://dancebattle.org/ontology/level"},
    "age": {"@id": "https://dancebattle.org/ontology/age"},
    "gender": {"@id": "https://dancebattle.org/ontology/gender"},
    "hasBattle": {"@id": "https://dancebattle.org/ontology/hasBattle"},
    "country": {"@id": "https://dancebattle.org/ontology/representsCountry"},
    "inviteOnly": {"@id": "https://dancebattle.org/ontology/inviteOnly"},
    "participants": {"@id": "https://dancebattle.org/ontology/amountOfParticipants"},
    "Event": {"@id": "https://dancebattle.org/ontology/DanceEvent"},
    "Battle": {"@id": "https://dancebattle.org/ontology/DanceBattle"},
    "Dancer": {"@id": "https://dancebattle.org/ontology/Dancer"}
  }
};

const originalContext = JSON.parse(JSON.stringify(context['@context']));

// Create a GraphQL-LD client based on a client-side Comunica engine
const client = new Client({context, queryEngine});

async function main() {
  console.log(`${__filename} started.`);

  let countries = [];

  // Get all.html events that have at least one battle and have a location.
  let query = `
  query { 
    location @single
    hasBattle @single
  }`;

  const events = await executeQuery(query);

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

  const winners = await executeQuery(query);

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

async function executeQuery(query) {
  const {data} = await client.query({query});

  return data;
}

module.exports = useCache(main, 'countries.json');