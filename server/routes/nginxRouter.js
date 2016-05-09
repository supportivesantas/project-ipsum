const nginxRouter = require('express').Router();
const ctrl = require('../controllers/nginxController.js');

nginxRouter.route('/balancers')
  .post(ctrl.newLoadBalancer)
  .delete(ctrl.removeLoadBalancer);

nginxRouter.route('/slaves')
  .post(ctrl.addSlave);

module.exports = nginxRouter;
