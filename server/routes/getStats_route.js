var getStatsRoutes = require('express').Router();
var getStatsController = require('../controllers/getStats_controller');

getStatsRoutes.route('/server').post(getStatsController.singleServer);
getStatsRoutes.route('/app').post(getStatsController.singleApp);
getStatsRoutes.route('/serverTotalsForApp').post(getStatsController.serverTotalsForApp);
// getStatsRoutes.route('/allAppSummaries').post(getStatsController.allAppSummaries);
//yesterday/the week/  the month
//total routes of app
//total hits of apps
//total servers / active or inactive
//graph total hits per day over last week

module.exports = getStatsRoutes;
