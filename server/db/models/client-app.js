var db = require('../config.js');

var ClientApp = db.Model.extend({
  tableName: 'clientApps',
});

module.exports = ClientApp;
