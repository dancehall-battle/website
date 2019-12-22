const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const getCountryName = require('country-list').getName;
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache, parseDates, createNameForBattle, getOrganizerInstagram} = require('./utils');
const fs = require('fs-extra');

let events;

module.exports = useCache(main, 'events.json');

async function main() {
  console.log(`${__filename} started.`);

  if (!events) {
    const context = await fs.readJson('./context.json');
    const originalContext = JSON.parse(JSON.stringify(context['@context']));

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
    instagram @single
    hasBattle {
      id @single
      name @single
      level @single
      gender @single
      age @single
      start @single 
      end @single
      participants @single
      inviteOnly @single
      hasWinner {
        type # useful for the embedded JSON-LD 
        id @single
        name @single
        country @single
      }
    }
  }`;

    // Execute the query
    events = await executeQuery(query);

    for (let i = 0; i < events.length; i ++) {
      const event = events[i];
      event.originalQueryResults = {
        '@graph': recursiveJSONKeyTransform(key => {
          if (key === 'id' || key === 'type') {
            key = '@' + key;
          }

          return key;
        })(JSON.parse(JSON.stringify(event))),
        '@context': originalContext
      };

      event.slug = event.id.replace('https://dancehallbattle.org/event/', '');
      parseDates(event);
      event.location = {
        code: event.location,
        name: getCountryName(event.location)
      };

      event.hasBattle.forEach(battle => {
        battle.name = createNameForBattle(battle);
        parseDates(battle);
      });

      event.organizers = await getOrganizerInstagram(event.id);
    }

    // TODO parse battles (name, dates...)

    async function executeQuery(query) {
      const {data} = await client.query({query});

      return data;
    }
  }

  console.log(`${__filename} done.`);

  return events;
}