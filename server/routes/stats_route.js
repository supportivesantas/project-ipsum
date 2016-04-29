var statsRoutes = require('express').Router();
var statsController = require('../controllers/stats_controller');

statsRoutes.route('/').post(statsController.processStats);
statsRoutes.route('/register').post(statsController.registerClient);

module.exports = statsRoutes;
