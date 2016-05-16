const nginxRouter = require('express').Router();
const ctrl = require('../controllers/nginxController.js');
const auth = require('../auth/configRoutes.js');

nginxRouter.route('/balancers')
  .put(auth.ensureAuthenticated, ctrl.updateLoadBalancer)
  .post(auth.ensureAuthenticated, ctrl.newLoadBalancer)
  .get(auth.ensureAuthenticated, ctrl.getLoadBalancers)
  .delete(auth.ensureAuthenticated, ctrl.removeLoadBalancer);

nginxRouter.route('/slaves')
  .post(auth.ensureAuthenticated, ctrl.addSlave)
  .get(auth.ensureAuthenticated, ctrl.allSlaves);

module.exports = nginxRouter;
