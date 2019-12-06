const {Client} = require('graphql-ld/index');
const queryEngine = require('../_data-core/engine');
const recursiveJSONKeyTransform = require('recursive-json-key-transform');
const {useCache} = require('../_data-core/utils');
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

const client = new Client({context, queryEngine});

async function main() {
  console.log(`${__filename} started.`);

  // console.dir(ranking, {depth: null});
  const countryHomeAway = await getCountryRankingByID(await getCountryHomeAwayID());
  sortCountriesMap(countryHomeAway.map);

  const countryHome = await getCountryRankingByID(await getCountryHomeID());
  const countryAway = await getCountryRankingByID(await getCountryAwayID());

  const dancerCombined = await getDancerRankingByID(await getDancerCombinedID());
  sortDancersMap(dancerCombined.map);

  const dancer1vs1 = await getDancerRankingByID(await getDancer1vs1ID());
  sortDancersMap(dancer1vs1.map);

  const dancer2vs2 = await getDancerRankingByID(await getDancer2vs2ID());
  sortDancersMap(dancer2vs2.map);

  console.log(`${__filename} done.`);

  return {
    countryHomeAway: {
      map: countryHomeAway.map,
      created: countryHomeAway.created,
      ranks: Object.keys(countryHomeAway.map),
      jsonld: countryHomeAway.originalQueryResults
    },
    countryHome: {
      map: countryHome.map,
      created: countryHome.created,
      ranks: Object.keys(countryHome.map),
      jsonld: countryHome.originalQueryResults
    },
    countryAway: {
      map: countryAway.map,
      created: countryAway.created,
      ranks: Object.keys(countryAway.map),
      jsonld: countryAway.originalQueryResults
    },
    dancerCombined: {
      map: dancerCombined.map,
      created: dancerCombined.created,
      ranks: Object.keys(dancerCombined.map),
      jsonld: dancerCombined.originalQueryResults
    },
    dancer1vs1: {
      map: dancer1vs1.map,
      created: dancer1vs1.created,
      ranks: Object.keys(dancer1vs1.map),
      jsonld: dancer1vs1.originalQueryResults
    },
    dancer2vs2: {
      map: dancer2vs2.map,
      created: dancer2vs2.created,
      ranks: Object.keys(dancer2vs2.map),
      jsonld: dancer2vs2.originalQueryResults
    }
  };
}

async function getCountryRankingByID(id) {
  context['@context'].ID = id;

  const client = new Client({context, queryEngine});

  const query = `
  query { 
    id (_:ID)
    type # for JSON-LD
    created @single
    items {
      id @single # for JSON-LD
      country @single
      position @single
      points @single
    }
  }`;

  let ranking = (await client.query({query})).data[0];
  ranking.id = id;
  //console.dir(ranking, {depth: null});

  const originalQueryResults = {
    '@context': JSON.parse(JSON.stringify(context['@context']))
  };

  originalQueryResults['@graph'] = recursiveJSONKeyTransform(key => {
    if (key === 'id' || key === 'type') {
      key = '@' + key;
    }

    return key;
  })(JSON.parse(JSON.stringify(ranking)));

  ranking.items.forEach(rank => {
    rank.country = {
      code: rank.country,
      name: getCountryName(rank.country)
    }
  });

  // console.dir(ranking, {depth: null});
  return {map: restructure(ranking), created: format(new Date(ranking.created), 'yyyy-MM-dd'), originalQueryResults};
}

async function getDancerRankingByID(id) {
  context['@context'].ID = id;

  const client = new Client({context, queryEngine});

  const query = `
  query { 
    id (_:ID)
    type # for JSON-LD
    created @single
    items {
      dancer @single {
        id @single
        name @single
        represents @single
      }
      id @single # for JSON-LD
      position @single
      points @single
    }
  }`;

  let ranking = (await client.query({query})).data[0];
  ranking.id = id;
  //console.dir(ranking, {depth: null});

  const originalQueryResults = {
    '@context': JSON.parse(JSON.stringify(context['@context']))
  };

  originalQueryResults['@graph'] = recursiveJSONKeyTransform(key => {
    if (key === 'id' || key === 'type') {
      key = '@' + key;
    }

    return key;
  })(JSON.parse(JSON.stringify(ranking)));

  return {map: restructure(ranking), created: format(new Date(ranking.created), 'yyyy-MM-dd'), originalQueryResults};
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

  console.log(rankings);

  if (rankings.length > 0) {
    let latestRanking = rankings[0];

    for (let i = 1; i < rankings.length; i ++) {
      console.log(latestRanking.created);
      console.log(rankings[i].created);
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

function sortDancersMap(map) {
  Object.keys(map).forEach(position => {
    map[position].sort((a, b) => {
      if (a.dancer.name < b.dancer.name) {
        return -1;
      } else if (a.dancer.name > b.dancer.name) {
        return 1;
      } else {
        return 0;
      }
    });
  });
}

function sortCountriesMap(map) {
  Object.keys(map).forEach(position => {
    map[position].sort((a, b) => {
      if (a.country.name < b.country.name) {
        return -1;
      } else if (a.country.name > b.country.name) {
        return 1;
      } else {
        return 0;
      }
    });
  });
}

module.exports = useCache(main, 'rankings.json');