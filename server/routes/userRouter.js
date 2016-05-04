var userRouter = require('express').Router();
var userController = require('../controllers/user_controller.js');
var appController = require('../controllers/appController.js');

userRouter.route('/userdata')
  .get(userController.getUserData);

userRouter.route('/userapps')
  .get(appController.getUserApps);


module.exports = userRouter;
