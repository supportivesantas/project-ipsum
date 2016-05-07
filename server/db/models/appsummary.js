const db = require('../config.js');

const AppSummary = db.Model.extend({
  tableName: 'appsummaries',
  hasTimestamps: true,
});

module.exports = AppSummary;
