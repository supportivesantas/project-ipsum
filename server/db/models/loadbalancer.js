var db = require('../config.js');
var clientServers = require('./client-server');

const LoadBalancer = db.Model.extend({
  tableName: 'stats',
  hasTimestamps: true,

  clientServers: () => {
    return this.belongsTo(clientServers);
  },
});

module.exports = LoadBalancer;
