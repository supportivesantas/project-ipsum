var db = require('../config.js');

var ClientServer = db.Model.extend({
  tableName: 'clientServers',

  loadbalancers: function() {
    return this.belongsTo(loadbalancers, 'master');
  },
});

module.exports = ClientServer;
