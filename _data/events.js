const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const {format} = require('date-fns');
const getCountryName = require('country-list').getName;
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {createNameForBattle, useCache} = require('./utils');

module.exports = useCache(main, 'events.json');

async function main() {

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
      "atEvent": {"@reverse": "https://dancebattle.org/ontology/hasBattle"},
      "country": {"@id": "https://dancebattle.org/ontology/representsCountry"},
      "inviteOnly": {"@id": "https://dancebattle.org/ontology/inviteOnly"},
      "participants": {"@id": "https://dancebattle.org/ontology/amountOfParticipants"},
      "Event": {"@id": "https://dancebattle.org/ontology/DanceEvent"},
      "Battle": {"@id": "https://dancebattle.org/ontology/DanceBattle"},
      "Dancer": {"@id": "https://dancebattle.org/ontology/Dancer"}
    }
  };

  const originalQueryResults = {
    '@context': JSON.parse(JSON.stringify(context['@context']))
  };

// Create a GraphQL-LD client based on a client-side Comunica engine
  const client = new Client({context, queryEngine});

  // Define a query
  const query = `
  query { 
    type # useful for the embedded JSON-LD 
    id @single
    name @single
    location @single
    start @single
    end @single
    hasBattle
  }`;

  // Execute the query
  let result = await executeQuery(query);
  result.forEach(event => {
    event.slug = event.id.replace('https://dancehallbattle.org/event/', '');
  });

  originalQueryResults['@graph'] = recursiveJSONKeyTransform(key => {
    if (key === 'id' || key === 'type') {
      key = '@' + key;
    }

    return key;
  })(JSON.parse(JSON.stringify(result)));

  console.log(result);

  return result;

  async function executeQuery(query) {
    const {data} = await client.query({query});

    return data;
  }
}