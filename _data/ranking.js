const {Client} = require('graphql-ld/index');
const queryEngine = require('./engine');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache} = require('./utils');
const getCountryName = require('country-list').getName;
const {format} = require('date-fns');

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
    "created": "schema:dateCreated",
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
  const countryHomeAway = await getCountryRankingByID(await getCountryHomeAwayID());
  const countryHome = await getCountryRankingByID(await getCountryHomeID());
  const countryAway = await getCountryRankingByID(await getCountryAwayID());

  const dancerCombined = await getDancerRankingByID(await getDancerCombinedID());
  const dancer1vs1 = await getDancerRankingByID(await getDancer1vs1ID());
  const dancer2vs2 = await getDancerRankingByID(await getDancer2vs2ID());

  console.log(`${__filename} done.`);

  return {
    countryHomeAway: {
      map: countryHomeAway.map,
      created: countryHomeAway.created,
      ranks: Object.keys(countryHomeAway.map)
    },
    countryHome: {
      map: countryHome.map,
      created: countryHome.created,
      ranks: Object.keys(countryHome.map)
    },
    countryAway: {
      map: countryAway.map,
      created: countryAway.created,
      ranks: Object.keys(countryAway.map)
    },
    dancerCombined: {
      map: dancerCombined.map,
      created: dancerCombined.created,
      ranks: Object.keys(dancerCombined.map)
    },
    dancer1vs1: {
      map: dancer1vs1.map,
      created: dancer1vs1.created,
      ranks: Object.keys(dancer1vs1.map)
    },
    dancer2vs2: {
      map: dancer2vs2.map,
      created: dancer2vs2.created,
      ranks: Object.keys(dancer2vs2.map)
    }
  };
}

async function getCountryRankingByID(id) {
  context['@context'].ID = id;

  const client = new Client({context, queryEngine});

  const query = `
  query { 
    id (_:ID)
    created @single
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
  return {map: restructure(ranking), created: format(new Date(ranking.created), 'yyyy-MM-dd')};
}

async function getDancerRankingByID(id) {
  context['@context'].ID = id;

  const client = new Client({context, queryEngine});

  const query = `
  query { 
    id (_:ID)
    created @single
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
  return {map: restructure(ranking), created: format(new Date(ranking.created), 'yyyy-MM-dd')};
}

async function getCountryHomeAwayID() {
  return await getRankingID(ranking => {
    return (ranking['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') !== -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/HomeRanking') === -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/AwayRanking') === -1);
  });
}

async function getCountryHomeID() {
  return await getRankingID(ranking => {
    return (ranking['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') !== -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/HomeRanking') !== -1);
  });
}

async function getCountryAwayID() {
  return await getRankingID(ranking => {
    return (ranking['type'].indexOf('https://dancehallbattle.org/ontology/CountryRanking') !== -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/AwayRanking') !== -1);
  });
}

async function getDancerCombinedID() {
  return await getRankingID(ranking => {
    return (ranking['type'].indexOf('https://dancehallbattle.org/ontology/DancerRanking') !== -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/1vs1Ranking') === -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/2vs2Ranking') === -1);
  });
}

async function getDancer1vs1ID() {
  return await getRankingID(ranking => {
    return (ranking['type'].indexOf('https://dancehallbattle.org/ontology/DancerRanking') !== -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/1vs1Ranking') !== -1);
  });
}

async function getDancer2vs2ID() {
  return await getRankingID(ranking => {
    return (ranking['type'].indexOf('https://dancehallbattle.org/ontology/DancerRanking') !== -1 &&
      ranking['type'].indexOf('https://dancehallbattle.org/ontology/2vs2Ranking') !== -1);
  });
}

async function getRankingID(filter) {
  let rankings = await getRankings();

  rankings = rankings.filter(filter);

  if (rankings.length > 0) {
    let latestRanking = rankings[0];

    for (let i = 1; i < rankings.length; i ++) {
      if (new Date(latestRanking.created) < new Date(rankings[i].created)) {
        latestRanking = rankings[i];
      }
    }

    return latestRanking.id;
  } else {
    return null;
  }
}

async function getRankings() {
  const query = `
  query { 
    id @single
    type(_:RANKING)
    type
    created @single
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