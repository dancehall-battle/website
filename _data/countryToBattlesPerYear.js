async function main() {
  const perYear = (await require('./_battles')).perYear;
  const years = Object.keys(perYear);
  const countryToBattlesPerYear = {};
  const countryToYears = {};
  const codes = [];

  years.forEach(year => {
    const battles = perYear[year];

    battles.forEach(battle => {
      const locations = [];

      battle.hasWinner.forEach(winner => {
        if (winner.country !== '' && locations.indexOf(winner.country) === -1) {
          locations.push(winner.country);
        }
      });

      locations.forEach(location => {
        if (!countryToBattlesPerYear[location]) {
          codes.push(location);
          countryToBattlesPerYear[location] = {};
          countryToYears[location] = [];
        }

        if (!countryToBattlesPerYear[location][year]) {
          countryToBattlesPerYear[location][year] = [];
          countryToYears[location].push(year);
        }

        countryToBattlesPerYear[location][year].push(battle);
      });
    })
  });

  const result = {};

  codes.forEach(code => {
    result[code] = {
      perYear: countryToBattlesPerYear[code],
      years: countryToYears[code]
    };
  });

  return result;
}

module.exports = main;