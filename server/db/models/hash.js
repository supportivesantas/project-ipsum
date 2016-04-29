var db = require('../config.js');
var clientApps = require('./client-app');
var clientServers = require('./client-server');

var Hash = db.Model.extend({
  tableName: 'hashes',

  clientApps: function() {
    return this.belongsTo(clientApps);
  },

  clientServers: function () {
    return this.belongsTo(clientServers);
  }
});

module.exports = Hash;
