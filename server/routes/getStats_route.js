var getStatsRoutes = require('express').Router();
var getStatsController = require('../controllers/getStats_controller');

getStatsRoutes.route('/server').post(getStatsController.singleServer);
getStatsRoutes.route('/app').post(getStatsController.singleApp);
getStatsRoutes.route('/serverTotalsForApp').post(getStatsController.serverTotalsForApp);

module.exports = getStatsRoutes;
