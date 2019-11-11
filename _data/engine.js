const {QueryEngineComunica} = require('graphql-ld-comunica/index');
const comunicaConfig = {
  sources: [
    { type: "hypermedia", value: "https://data.dancehallbattle.org/data" },
    { type: "hypermedia", value: "http://localhost:3000/all" },
  ],
};

module.exports = new QueryEngineComunica(comunicaConfig);