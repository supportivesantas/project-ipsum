var getStatsRoutes = require('express').Router();
var getStatsController = require('../controllers/getStats_controller');

getStatsRoutes.route('/server').get(getStatsController.singleServer);

module.exports = getStatsRoutes;
