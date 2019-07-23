const site = {
  "title": "Dancehall Battle",
  "baseURL": "https://dancehallbattle.org",
  "description": "List of Dancehall battles and their winners."
};

module.exports = function() {
  site.simpleURL = site.baseURL.replace('http://', '').replace('https://', '');

  return site;
};
