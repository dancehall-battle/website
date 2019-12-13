const {QueryEngineComunica} = require('graphql-ld-comunica/index');
const comunicaConfig = {
  sources: [
    { type: "hypermedia", value: "https://data.dancehallbattle.org/data" },
    { type: "hypermedia", value: "https://data.dev.dancehallbattle.org/rankings" },
  ],
};

module.exports = new QueryEngineComunica(comunicaConfig);