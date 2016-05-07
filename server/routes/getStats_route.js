var getStatsRoutes = require('express').Router();
var getStatsController = require('../controllers/getStats_controller');
var getSummaryStatsController = require('../controllers/getSummaryStats_controller');

getStatsRoutes.route('/server').post(getStatsController.singleServer);
getStatsRoutes.route('/app').post(getStatsController.singleApp);
getStatsRoutes.route('/serverTotalsForApp').post(getStatsController.serverTotalsForApp);
getStatsRoutes.route('/allAppSummaries').post(getSummaryStatsController.allAppSummaries);
getStatsRoutes.route('/myServerSummary').post(getSummaryStatsController.myServerSummary);


module.exports = getStatsRoutes;
