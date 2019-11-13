const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache} = require('./utils');
const getCountryName = require('country-list').getName;

// Define a JSON-LD context
const context = {
  "@context": {
    "type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "schema": "http://schema.org/",
    "items": "schema:itemListElement",
    "country": "schema:item",
    "dancer": "schema:item",
    "position": "schema:position",
    "name": "schema:name",
    "represents": "https://dancebattle.org/ontology/representsCountry",
    "points": "https://dancehallbattle.org/ontology/points",
    "RANKING": "https://dancehallbattle.org/ontology/Ranking"
  }
};

const originalContext = JSON.parse(JSON.stringify(context['@context']));

const client = new Client({context, queryEngine});

async function main() {
  console.log(`${__filename} started.`);

  // console.dir(ranking, {depth: null});
  const countryHomeAwayMap = await getCountryRankingByID(await getCountryHomeAwayID());
  const countryHomeMap = await getCountryRankingByID(await getCountryHomeID());
  const countryAwayMap = await getCountryRankingByID(await getCountryAwayID());

  const dancerCombinedMap = await getDancerRankingByID(await getDancerCombinedID());
  const dancer1vs1Map = await getDancerRankingByID(await getDancer1vs1ID());
  const dancer2vs2Map = await getDancerRankingByID(await getDancer2vs2ID());

  console.log(`${__filename} done.`);

  return {
    countryHomeAway: {
      map: countryHomeAwayMap,
      ranks: Object.keys(countryHomeAwayMap)
    },
    countryHome: {
      map: countryHomeMap,
      ranks: Object.keys(countryHomeMap)
    },
    countryAway: {
      map: countryAwayMap,
      ranks: Object.keys(countryAwayMap)
    },
    dancerCombined: {
      map: dancerCombinedMap,
      ranks: Object.keys(dancerCombinedMap)
    },
    dancer1vs1: {
      map: dancer1vs1Map,
      ranks: Object.keys(dancer1vs1Map)
    },
    dancer2vs2: {
      map: dancer2vs2Map,
      ranks: Object.keys(dancer2vs2Map)
    }
  };
}

async function getCountryRankingByID(id) {
  context['@context'].ID = id;

  const client = new Client({context, queryEngine});

  const query = `
  query { 
    id (_:ID)
    items {
      country @single
      position @single
      points @single
    }
  }`;

  let ranking = (await client.query({query})).data[0];
  //console.dir(ranking, {depth: null});

  ranking.items.forEach(rank => {
    rank.country = {
      code: rank.country,
      name: getCountryName(rank.country)
    }
  });

  // console.dir(ranking, {depth: null});
  return restructure(ranking);
}

async function getDancerRankingByID(id) {
  context['@context'].ID = id;

  const client = new Client({context, queryEngine});

  const query = `
  query { 
    id (_:ID)
    items {
      dancer @single {
        id @single
        name @single
        represents @single
      }
      position @single
      points @single
    }
  }`;

  let ranking = (await client.query({query})).data[0];
  console.dir(ranking, {depth: null});

  // console.dir(ranking, {depth: null});
  return restructure(ranking);
}

async function getCountryHomeAwayID() {
  const rankings = await getRankings();
  let i = 0;

  while (i < rankings.length &&
  (rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') === -1 ||
  rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/HomeRanking') !== -1 ||
  rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/AwayRanking') !== -1)) {
    i ++;
  }

  return rankings[i].id;
}

async function getCountryHomeID() {
  const rankings = await getRankings();
  let i = 0;

  while (i < rankings.length &&
  (rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') === -1 ||
    rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/HomeRanking') === -1)) {
    i ++;
  }

  return rankings[i].id;
}

async function getCountryAwayID() {
  const rankings = await getRankings();
  let i = 0;

  while (i < rankings.length &&
  (rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') === -1 ||
    rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/AwayRanking') === -1)) {
    i ++;
  }

  return rankings[i].id;
}

async function getDancerCombinedID() {
  const rankings = await getRankings();
  let i = 0;

  while (i < rankings.length &&
  (rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/DancerRanking') === -1 ||
    rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/1vs1Ranking') !== -1 ||
    rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/2vs2Ranking') !== -1)) {
    i ++;
  }

  return rankings[i].id;
}

async function getDancer1vs1ID() {
  const rankings = await getRankings();
  let i = 0;

  while (i < rankings.length &&
  (rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/DancerRanking') === -1 ||
    rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/1vs1Ranking') === -1)) {
    i ++;
  }

  return rankings[i].id;
}

async function getDancer2vs2ID() {
  const rankings = await getRankings();
  let i = 0;

  while (i < rankings.length &&
  (rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/DancerRanking') === -1 ||
    rankings[i]['type'].indexOf('https://dancehallbattle.org/ontology/2vs2Ranking') === -1)) {
    i ++;
  }

  return rankings[i].id;
}

async function getRankings() {
  const query = `
  query { 
    id @single
    type(_:RANKING)
    type
  }`;

  return (await client.query({query})).data;
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