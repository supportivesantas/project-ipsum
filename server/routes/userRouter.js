const userRouter = require('express').Router();
const userController = require('../controllers/user_controller.js');

userRouter.route('/userid')
  .get(userController.getUserId);

userRouter.route('/userapps')
  .get(userController.getUserApps);

userRouter.route('/userservers')
  .get(userController.getUserServers);

userRouter.route('/init')
  .get(userController.getInit);


module.exports = userRouter;
