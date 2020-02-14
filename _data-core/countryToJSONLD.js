const {useCache} = require('./utils');

async function main() {
  console.log(`${__filename} started.`);

  const {originalQueryResults} = (await require('./_battles'));
  const countryToBattles = (await require('./_countryToBattles'));
  const countryToEvents = (await require('./_countryToEvents'));
  const countries = Object.keys(countryToBattles).concat(Object.keys(countryToEvents));
  const countryToJSONLD = {};

  countries.forEach(country => {
    const battleJSONLD = {
      '@context': originalQueryResults['@context'],
      '@graph': []
    };
    const battles = countryToBattles[country];

    if (battles) {
      battles.forEach(battle => {
        const allBattles = originalQueryResults['@graph'];
        let i = 0;

        while (i < allBattles.length &&
        allBattles[i]['@id'].substring(allBattles[i]['@id'].lastIndexOf('/') + 1) !==
        battle.id.substring(battle.id.lastIndexOf('/') + 1)) {
          i++;
        }

        if (i < originalQueryResults['@graph'].length) {
          battleJSONLD['@graph'].push(originalQueryResults['@graph'][i]);
        }
      });
    }

    countryToJSONLD[country] = [battleJSONLD];

    const events = countryToEvents[country];

    if (events) {
      events.forEach(event => {
        countryToJSONLD[country].push(event.originalQueryResults);
      });
    }
  });

  //console.dir(countryToJSONLD, {depth: null});
  console.log(`${__filename} done.`);

  return countryToJSONLD;
}

module.exports = useCache(main, 'country-to-jsonld.json');