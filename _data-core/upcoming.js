const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache, parseDates, getOrganizerInstagram} = require('./utils');
const fs = require('fs-extra');
const path = require('path');

let client;

async function main() {
  console.log(`${__filename} started.`);

  const context = await fs.readJson(path.join(__dirname, '../context.json'));

  const originalQueryResults = {
    '@context': JSON.parse(JSON.stringify(context['@context']))
  };

// Create a GraphQL-LD client based on a client-side Comunica engine
  client = new Client({ context, queryEngine });

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

  for (let i = 0; i < result.length; i ++) {
    const event = result[i];

    if (event.instagram === '') {
      event.instagram = await getOrganizerInstagram(event.id);
    } else {
      event.instagram = [event.instagram];
    }
  }

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

  //console.log(result);
  console.log(`${__filename} done.`);

  return {data: result, originalQueryResults};
}

async function executeQuery(query){
  const {data} = await client.query({ query });

  return data;
}

module.exports = useCache(main, 'upcoming.json');