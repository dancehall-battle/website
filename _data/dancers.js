const {Client} = require('graphql-ld/index');
const {QueryEngineComunica} = require('graphql-ld-comunica/index');
const {format} = require('date-fns');
const getCountryName = require('country-list').getName;
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {createNameForBattle} = require('./utils');

// Define a JSON-LD context
const context = {
  "@context": {
    "type":  { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
    "label":  { "@id": "http://www.w3.org/2000/01/rdf-schema#label" },
    "name":  { "@id": "http://schema.org/name" },
    "start":  { "@id": "http://schema.org/startDate" },
    "end":    { "@id": "http://schema.org/endDate" },
    "location":    { "@id": "http://schema.org/location" },
    "hasWinner":    { "@id": "https://dancebattle.org/ontology/hasWinner" },
    "wins":    { "@reverse": "https://dancebattle.org/ontology/hasWinner" },
    "level":    { "@id": "https://dancebattle.org/ontology/level" },
    "age":    { "@id": "https://dancebattle.org/ontology/age" },
    "gender":    { "@id": "https://dancebattle.org/ontology/gender" },
    "hasBattle":    {  "@id": "https://dancebattle.org/ontology/hasBattle" },
    "atEvent":    {  "@reverse": "https://dancebattle.org/ontology/hasBattle" },
    "country":    { "@id": "https://dancebattle.org/ontology/representsCountry" },
    "inviteOnly":    { "@id": "https://dancebattle.org/ontology/inviteOnly" },
    "participants":    {  "@id": "https://dancebattle.org/ontology/amountOfParticipants" },
    "Event": { "@id": "https://dancebattle.org/ontology/DanceEvent" },
    "Battle": { "@id": "https://dancebattle.org/ontology/DanceBattle" },
    "Dancer": { "@id": "https://dancebattle.org/ontology/Dancer" }
  }
};

const originalQueryResults = {
  '@context': JSON.parse(JSON.stringify(context['@context']))
};

// Create a GraphQL-LD client based on a client-side Comunica engine
const comunicaConfig = {
  sources: [
    { type: "hypermedia", value: "https://data.dancehallbattle.org/data" },
  ],
};
const client = new Client({ context, queryEngine: new QueryEngineComunica(comunicaConfig) });

// Define a query
const query = `
  query { 
    type # useful for the embedded JSON-LD 
    id @single
    name @single
    country @single
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

async function executeQuery(query){
  const {data} = await client.query({ query });

  return data;
}

function parseDates(battle, dancer) {
  const date = new Date(battle.start);

  battle.date = format(date, 'MMM d', {awareOfUnicodeTokens: true});
  battle.year = (date.getFullYear());

  if (!dancer.yearBattleMap) {
    dancer.yearBattleMap = {};
  }

  if (!dancer.yearBattleMap[battle.year]) {
    dancer.yearBattleMap[battle.year] = [];
  }

  dancer.yearBattleMap[battle.year].push(battle);
}

function getPostfix(dancer) {
  dancer.postfix = dancer.id.replace('https://dancehallbattle.org/dancer/', '');
}

module.exports = async () => {
  // Execute the query
  let dancers = await executeQuery(query);
  originalQueryResults['@graph'] = recursiveJSONKeyTransform(key => {
    if (key === 'id' || key === 'type') {
      key = '@' + key;
    }

    return key;
  })(JSON.parse(JSON.stringify(dancers)));

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

    dancer.wins.forEach(battle => {
      parseDates(battle, dancer);
      battle.name = createNameForBattle(battle);
    });

    dancer.years = Object.keys(dancer.yearBattleMap);
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

  return {originalQueryResults, data: dancers, perLetter, letters};
};