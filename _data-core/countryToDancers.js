async function main() {
  const dancers = await require('./_dancers');
  const countryToDancers = {};

  dancers.forEach(dancer => {
    if (dancer.country !== '') {
      if (!countryToDancers[dancer.country]) {
        countryToDancers[dancer.country] = [];
      }

      countryToDancers[dancer.country].push(dancer);
    }
  });

  const codes = Object.keys(countryToDancers);

  codes.forEach(code => {
    const dancers = countryToDancers[code];

    countryToDancers[code] = dancers.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  });

  return countryToDancers;
}

module.exports = main;