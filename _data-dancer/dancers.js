const {Client} = require('graphql-ld/index');
const queryEngine = require('../_data-core/engine');
const {format} = require('date-fns');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {createNameForBattle, useCache} = require('../_data-core/utils');
const fs = require('fs-extra');
const path = require('path');

async function main() {
  console.log(`${__filename} started.`);

  const context = await fs.readJson(path.join(__dirname, '../context.json'));
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
    instagram @single
    wins {
      id @single
      type # useful for the embedded JSON-LD 
      name @single
      level @single
      gender @single
      age @single
      start @single 
      end @single
      participants @single
      inviteOnly @single
      atEvent @single {
        type # useful for the embedded JSON-LD 
        id @single
        name @single
        location @single
      }
    }
  }`;

  // Execute the query
  let dancers = (await client.query({query})).data;

  dancers.forEach(dancer => {
    dancer.originalQueryResults = {
      '@context': originalContext,
      '@graph': recursiveJSONKeyTransform(key => {
        if (key === 'id' || key === 'type') {
          key = '@' + key;
        }

        return key;
      })(JSON.parse(JSON.stringify(dancer)))
    };
  });


  //console.log(dancers);
  //console.dir(result, { depth: null });

  dancers.forEach(dancer => {
    getPostfix(dancer);

    dancer.wins.forEach(battle => {
      battle.date = format(new Date(battle.start), 'MMM d, yyyy', {awareOfUnicodeTokens: true});
      battle.name = createNameForBattle(battle);
    });

    dancer.wins.sort((a, b) => {
      const aDate = new Date(a.start);
      const bDate = new Date(b.start);

      if (aDate < bDate) {
        return 1;
      } else if (aDate > bDate) {
        return -1;
      } else {
        return 0;
      }
    });
  });

  console.log(`${__filename} done.`);

  return dancers;
}

function getPostfix(dancer) {
  dancer.postfix = dancer.id.replace('https://dancehallbattle.org/dancer/', '');
}

module.exports = useCache(main, 'dancers.json');