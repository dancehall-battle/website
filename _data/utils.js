const fs = require('fs-extra');
const path = require('path');

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
        if (err) {console.error(err)}
      });
    }

    dataInCache = result;
  }

  return dataInCache;
}

module.exports = {
  createNameForBattle,
  useCache
};