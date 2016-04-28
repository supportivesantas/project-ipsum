var db = require('../config.js');

var ClientServer = db.Model.extend({
  tableName: 'clientServers',
});

module.exports = ClientServer;
