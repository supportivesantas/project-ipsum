const userRouter = require('express').Router();
const userController = require('../controllers/user_controller.js');
const auth = require('../auth/configRoutes.js');

userRouter.route('/userid')
  .get(auth.ensureAuthenticated, userController.getUserId);

userRouter.route('/userapps')
  .get(auth.ensureAuthenticated, userController.getUserApps);

userRouter.route('/userservers')
  .get(auth.ensureAuthenticated, userController.getUserServers)
  .post(auth.ensureAuthenticated, userController.getUserServers);

userRouter.route('/usercreds')
  .get(auth.ensureAuthenticated, userController.getUserCreds)
  .post(auth.ensureAuthenticated, userController.postUserCreds)
  .put(auth.ensureAuthenticated, userController.putUserCreds)
  .delete(auth.ensureAuthenticated, userController.deleteUserCreds);

userRouter.route('/init')
  .get(auth.ensureAuthenticated, userController.getInit);

userRouter.route('/sessionreload')
  .get((req, res) => {
    if (req.user) {
      req.session.reload((err) => {
        if (err) {
          console.log(err);
          res.send('false');
        }
        res.cookie('il', 'true', { httpOnly: false });
        res.send('true');
      });
    } else {
      res.send('false');
    }
  });

module.exports = userRouter;
