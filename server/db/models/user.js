var db = require('../config.js');

var user = db.Model.extend({
  tableName: 'users',
});

module.exports = user;
