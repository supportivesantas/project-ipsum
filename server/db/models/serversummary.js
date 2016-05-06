const db = require('../config.js');

const serversummary = db.Model.extend({
  tableName: 'serversummaries',
});

module.exports = serversummary;
