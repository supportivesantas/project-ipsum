var db     = require('../config.js');
var Stat  = require('../models/stat.js');

var Stats = new db.Collection();

Stats.model = Stat;

module.exports = Stats;
