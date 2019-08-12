const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const {format} = require('date-fns');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache} = require('./utils');

// Define a JSON-LD context
const context = {
  "@context": {
    "type":  { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
    "name":  { "@id": "http://schema.org/name" },
    "start":  { "@id": "http://schema.org/startDate" },
    "end":    { "@id": "http://schema.org/endDate" },
    "location":    { "@id": "http://schema.org/location" },
    "instagram": { "@id": "https://dancebattle.org/ontology/instagram" },
    "Event": { "@id": "https://dancebattle.org/ontology/DanceEvent" },
  }
};

const originalQueryResults = {
  '@context': JSON.parse(JSON.stringify(context['@context']))
};

// Create a GraphQL-LD client based on a client-side Comunica engine
const client = new Client({ context, queryEngine });

// Define a query
const query = `
  query { 
    type # useful for the embedded JSON-LD 
    id @single
    name @single
    location @single
    start @single
    end @single
    instagram @single
  }`;

async function executeQuery(query){
  const {data} = await client.query({ query });

  return data;
}

function parseDates(event) {
  event.start = format(new Date(event.start), 'MMM d', {awareOfUnicodeTokens: true});
  event.end = format(new Date(event.end), 'MMM d', {awareOfUnicodeTokens: true});
}

async function main() {
  // Execute the query
  let result = await executeQuery(query);
  originalQueryResults['@graph'] = recursiveJSONKeyTransform(key => {
    if (key === 'id' || key === 'type') {
      key = '@' + key;
    }

    return key;
  })(JSON.parse(JSON.stringify(result)));

  //console.log(result);
  //console.dir(result, { depth: null });

  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

  result = result.filter(event => today <= new Date(event.end));

  result = result.sort((a, b) => {
    const aDate = new Date(a.start);
    const bDate = new Date(b.start);

    if (aDate < bDate) {
      return -1;
    } else if (aDate > bDate) {
      return 1;
    } else {
      return 0;
    }
  });

  result.forEach(event => {
    parseDates(event);
  });

  console.log(result);

  return {data: result, originalQueryResults};
}

module.exports = useCache(main, 'upcoming.json');