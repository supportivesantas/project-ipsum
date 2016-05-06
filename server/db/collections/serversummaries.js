const db = require('../config.js');
const serversummary = require('../models/serversummary.js');

const ServerSummaries = new db.Collection();

ServerSummaries.model = serversummary;

module.exports = ServerSummaries;
