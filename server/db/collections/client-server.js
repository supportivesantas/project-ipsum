var db = require('../config.js');
var ClientServer = require('../models/client-server.js');

var ClientServers = new db.Collection();

ClientServers.model = ClientServer;

module.exports = ClientServers;
