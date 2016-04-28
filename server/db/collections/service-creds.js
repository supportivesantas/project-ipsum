var db     = require('../config.js');
var ServiceCred  = require('../models/service-cred.js');

var ServiceCreds = new db.Collection();

ServiceCreds.model = ServiceCred;

module.exports = ServiceCreds;
