const db = require('../config.js');
const AppSummary = require('../models/appsummary.js');

const AppSummaries = new db.Collection();

AppSummaries.model = AppSummary;

module.exports = AppSummaries;
