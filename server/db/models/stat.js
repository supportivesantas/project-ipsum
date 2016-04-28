var db = require('../config.js');

var Stat = db.Model.extend({
  tableName: 'stats',
});

module.exports = Stat;
