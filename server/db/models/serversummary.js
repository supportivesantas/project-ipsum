const db = require('../config.js');

const ServerSummary = db.Model.extend({
  tableName: 'serversummaries',
  hasTimestamps: true,
});

module.exports = ServerSummary;
