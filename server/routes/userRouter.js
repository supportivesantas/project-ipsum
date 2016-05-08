const userRouter = require('express').Router();
const userController = require('../controllers/user_controller.js');

userRouter.route('/userid')
  .get(userController.getUserId);

userRouter.route('/userapps')
  .get(userController.getUserApps);

userRouter.route('/userservers')
  .get(userController.getUserServers);

userRouter.route('/userservers')
  .post(userController.getUserServers);

userRouter.route('/usercreds')
  .post(userController.postUserCreds);

userRouter.route('/usercreds')
  .get(userController.getUserCreds);

userRouter.route('/usercreds')
  .put(userController.putUserCreds);

userRouter.route('/usercreds')
  .delete(userController.deleteUserCreds);

userRouter.route('/init')
  .get(userController.getInit);


module.exports = userRouter;
