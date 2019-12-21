const {QueryEngineComunica} = require('graphql-ld-comunica/index');
const comunicaConfig = {
  sources: [
    { type: "hypermedia", value: "http://localhost:3000/output" },
    { type: "hypermedia", value: "https://data.dev.dancehallbattle.org/rankings" },
  ],
};

module.exports = new QueryEngineComunica(comunicaConfig);