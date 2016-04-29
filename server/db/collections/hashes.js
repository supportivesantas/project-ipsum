var db     = require('../config.js');
var Hash  = require('../models/hash');

var Hashes = new db.Collection();

Hashes.model = Hash;

module.exports = Hashes;
