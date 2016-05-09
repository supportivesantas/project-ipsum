const nginxRouter = require('express').Router();
const ctrl = require('../controllers/nginxController.js');

nginxRouter.route('/addbalancer')
  .post(ctrl.newLoadBalancer);

module.exports = nginxRouter;
