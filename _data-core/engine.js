const {QueryEngineComunica} = require('graphql-ld-comunica/index');
const tpfServers = require('../tpf-servers.json');

const comunicaConfig = {};

if (process.env.MODE && process.env.MODE === 'dev') {
  comunicaConfig.sources = tpfServers.dev;
  console.log('Using development TPF servers.');
} else {
  comunicaConfig.sources = tpfServers.live;
}

module.exports = new QueryEngineComunica(comunicaConfig);