var db = require('../config.js');
var ClientApp = require('../models/client-app.js');

var ClientApps = new db.Collection();

ClientApps.model = ClientApp;

module.exports = ClientApps;
