const db = require('../config.js');
const ServerSummary = require('../models/serversummary.js');

const ServerSummaries = new db.Collection();

ServerSummaries.model = ServerSummary;

module.exports = ServerSummaries;
