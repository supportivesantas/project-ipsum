var getStatsRoutes = require('express').Router();
var getStatsController = require('../controllers/getStats_controller');
var getSummaryStatsController = require('../controllers/getSummaryStats_controller');
var auth = require('../auth/configRoutes.js');

getStatsRoutes.route('/server').post(auth.ensureAuthenticated, getStatsController.singleServer);
getStatsRoutes.route('/app').post(auth.ensureAuthenticated, getStatsController.singleApp);
getStatsRoutes.route('/serverTotalsForApp').post(auth.ensureAuthenticated, getStatsController.serverTotalsForApp);
getStatsRoutes.route('/allAppSummaries').post(auth.ensureAuthenticated, getSummaryStatsController.allAppSummaries);
getStatsRoutes.route('/myServerSummary').post(auth.ensureAuthenticated, getSummaryStatsController.myServerSummary);
getStatsRoutes.route('/myAppSummary').post(auth.ensureAuthenticated, getSummaryStatsController.myAppSummary);

module.exports = getStatsRoutes;
