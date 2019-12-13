const {Client} = require('graphql-ld/index');
const queryEngine = require('../_data-core/engine');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache} = require('../_data-core/utils');

async function main() {
  console.log(`${__filename} started.`);

  // Define a JSON-LD context
  const context = {
    "@context": {
      "type": {"@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},
      "name": {"@id": "http://schema.org/name"},
      "wins": {"@reverse": "https://dancebattle.org/ontology/hasWinner"},
      "country": {"@id": "https://dancebattle.org/ontology/representsCountry"}
    }
  };

  const originalContext = JSON.parse(JSON.stringify(context['@context']));

  // Create a GraphQL-LD client based on a client-side Comunica engine
  const client = new Client({context, queryEngine});

  // Define a query
  const query = `
  query { 
    type # useful for the embedded JSON-LD 
    id @single
    name @single
    country @single
    wins {
      id @single
    }
  }`;

  // Execute the query
  let dancers = (await client.query({query})).data;

  const originalQueryResults = {
    '@context': originalContext,
    '@graph': recursiveJSONKeyTransform(key => {
      if (key === 'id' || key === 'type') {
        key = '@' + key;
      }

      return key;
    })(JSON.parse(JSON.stringify(dancers)))
  };

  //console.log(dancers);
  //console.dir(result, { depth: null });

  const perLetter = {};

  dancers.forEach(dancer => {
    getPostfix(dancer);

    const firstLetter = dancer.name[0];

    if (!perLetter[firstLetter]) {
      perLetter[firstLetter] = [];
    }

    perLetter[firstLetter].push(dancer);
  });

  const letters = Object.keys(perLetter).sort();

  letters.forEach(letter => {
    perLetter[letter].sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  });

  //console.log(perLetter);

  console.log(`${__filename} done.`);

  return {originalQueryResults, perLetter, letters};
}

function getPostfix(dancer) {
  dancer.postfix = dancer.id.replace('https://dancehallbattle.org/dancer/', '');
}

module.exports = useCache(main, 'dancer-list.json');