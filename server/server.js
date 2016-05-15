const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../webpack.config.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const stats_controller = require('./routes/stats_route');
const getStats_controller = require('./routes/getStats_route');
const userRouter = require('./routes/userRouter.js');
const nginxRouter = require('./routes/nginxRouter.js');
const msgCtrl = require('./controllers/notificationController.js');
//add this middleware to protected routes. redirects to github login page if not authenticated
const ensureAuthenticated = require('./auth/passport.js');

const app = express();

var isDeveloping = process.env.NODE_ENV !== 'production'; // do not change this to const

//To server the bundled file in a dev environment (simulating prod environment):
//  1. run `webpack  --config webpack.production.config.js` to create the bundle in /build (20-30 sec)
//  2. set isDeveloping to false (uncomment the line below)
// isDeveloping = false;
//  3. npm start
if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

/*======== GITHUB AUTHENTICATION SETUP ===========*/
const passport = require('passport');
const configRoutes = require('./auth/configRoutes');//ensureAuthenticated
require('./auth/passport')(passport); // pass passport for configuration
configRoutes.configRoutes(app, passport); // pass app for configuration
/*================================================*/

app.use('/getStats', /*configRoutes.ensureAuthenticated,*/ getStats_controller);
app.use('/stats', stats_controller);
app.use('/user', /*configRoutes.ensureAuthenticated,*/ userRouter);
app.use('/nginx', nginxRouter);

// api interface for interacting with digital_ocean, et al.
const configureRequest = require('./api/configure.js');
const makeRequest = require('./api/makeRequest.js');
const sendReply = require('./api/sendReply');
app.use('/api/:action', configureRequest, makeRequest, sendReply);

app.use(express.static(__dirname + '/../public'));
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, '/../public/index.html'));
});

module.exports = app;
