var db = require('../config.js');
var clientApps = require('./client-app');
var clientServers = require('./client-server');

var Hash = db.Model.extend({
  tableName: 'hashes',

  clientApps: function() {
    return this.belongsTo(clientApps, 'clientApps_id');
  },

  clientServers: function () {
    return this.belongsTo(clientServers, 'clientServers_id');
  }
});

module.exports = Hash;
