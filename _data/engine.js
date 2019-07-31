const {QueryEngineComunica} = require('graphql-ld-comunica/index');
const comunicaConfig = {
  sources: [
    { type: "hypermedia", value: "https://data.dancehallbattle.org/data" },
  ],
};

module.exports = new QueryEngineComunica(comunicaConfig);