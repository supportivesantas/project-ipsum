var db = require('../config.js');
var clientServers = require('./client-server');

const LoadBalancer = db.Model.extend({
  tableName: 'loadbalancers',
  hasTimestamps: true,
});

module.exports = LoadBalancer;
