var db = require('../config.js');
var LoadBalancer = require('../models/loadbalancer.js');

const LoadBalancers = new db.Collection();

LoadBalancers.model = LoadBalancer;

module.exports = LoadBalancers;
