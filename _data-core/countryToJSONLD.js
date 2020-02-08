const {useCache} = require('./utils');

async function main() {
  console.log(`${__filename} started.`);

  const {originalQueryResults} = (await require('./_battles'));
  const countryToBattles = (await require('./_countryToBattles'));
  const countries = Object.keys(countryToBattles);
  const countryToJSONLD = {};

  countries.forEach(country => {
    const jsonLD = {
      '@context': originalQueryResults['@context'],
      '@graph': []
    };
    const battles = countryToBattles[country];

    battles.forEach(battle => {
      const allBattles = originalQueryResults['@graph'];
      let i = 0;

      while (i < allBattles.length &&
      allBattles[i]['@id'].substring(allBattles[i]['@id'].lastIndexOf('/') + 1) !==
      battle.id.substring(battle.id.lastIndexOf('/') + 1)) {
        i++;
      }

      if (i < originalQueryResults['@graph'].length) {
        jsonLD['@graph'].push(originalQueryResults['@graph'][i]);
      }
    });

    countryToJSONLD[country] = jsonLD;
  });

  console.log(countryToJSONLD);
  console.log(`${__filename} done.`);

  return countryToJSONLD;
}

module.exports = useCache(main, 'country-to-jsonld.json');