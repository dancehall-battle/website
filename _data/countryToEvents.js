

async function main() {
  const events = await require('./_events');
  const countryToEvents = {};

  events.forEach(event => {
    if (event.location && event.location.code !== '') {
      if (!countryToEvents[event.location.code]) {
        countryToEvents[event.location.code] = [];
      }

      countryToEvents[event.location.code].push(event);
    }
  });

  // TODO sort events per country

  return countryToEvents;
}

module.exports = main;