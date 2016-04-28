var db = require('../config.js');

var ServiceCred = db.Model.extend({
  tableName: 'serviceCreds',
});

module.exports = ServiceCred;
