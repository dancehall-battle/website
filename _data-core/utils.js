const fs = require('fs-extra');
const path = require('path');
const {format, compareAsc} = require('date-fns');

function createNameForBattle(battle) {
  let label = battle.name;

  if (!label) {
    label = `${battle.participants} vs ${battle.participants}`;

    if (battle.level && battle.level !== 'all') {
      label += ` ${capitalize(battle.level)}`;
    }

    if (battle.age) {
      label += ` ${capitalize(battle.age)}`;
    }

    if (battle.gender) {
      label += ` ${capitalize(battle.gender)}`;
    }
  }

  return label;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

async function useCache(main, cacheFilename) {
  const skip = process.env.SKIP !== undefined && process.env.SKIP.toLowerCase().indexOf(cacheFilename.toLowerCase()) !== -1;

  if (skip) {
    console.log(`Skipping ${cacheFilename}`);
    return {};
  } else {
    const isServing = process.env.ELEVENTY_SERVE === 'true';

    const cacheFilePath = path.resolve(__dirname, '../_cache/' + cacheFilename);
    let dataInCache = null;

    if (isServing && await fs.pathExists(cacheFilePath)) {
      // Read file from cache.
      dataInCache = await fs.readJSON(cacheFilePath);
      console.log('Using from cache: ' + cacheFilename);
    }

    if (!dataInCache) {
      const result = await main();

      if (isServing) {
        // Write data to cache.
        fs.writeJSON(cacheFilePath, result, err => {
          if (err) {
            console.error(err)
          }
        });
      }

      dataInCache = result;
    }

    return dataInCache;
  }
}

function parseDates(event) {
  if (event.start !== '' && event.end !== '') {
    event.originalStart = event.start;
    event.originalEnd = event.end;

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    if (compareAsc(startDate, endDate) === 0) {
      event.formattedDate = format(startDate, 'MMM d, yyyy', {awareOfUnicodeTokens: true});
    } else {
      let start;
      //console.log(endDate);
      const end = format(endDate, 'MMM d, yyyy', {awareOfUnicodeTokens: true});

      if (startDate.getFullYear() === endDate.getFullYear()) {
        start = format(startDate, 'MMM d', {awareOfUnicodeTokens: true});
      } else {
        start = format(startDate, 'MMM d, yyyy', {awareOfUnicodeTokens: true});
      }

      event.formattedDate = `${start} - ${end}`;
    }

    event.start = format(new Date(event.start), 'MMM d', {awareOfUnicodeTokens: true});
    event.end = format(new Date(event.end), 'MMM d', {awareOfUnicodeTokens: true});
  }
}

function sortOnStartDate(events) {
  return events.sort((a, b) => {
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
}

module.exports = {
  createNameForBattle,
  useCache,
  parseDates,
  sortOnStartDate
};