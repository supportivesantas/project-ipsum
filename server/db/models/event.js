var db = require('../config.js');

var Event = db.Model.extend({
  tableName: 'events',
});

module.exports = Event;
