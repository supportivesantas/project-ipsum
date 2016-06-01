"use strict";
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../webpack.config.js');
const webpack = require('webpack');
const stats_controller = require('./routes/stats_route');
const getStats_controller = require('./routes/getStats_route');
const userRouter = require('./routes/userRouter.js');
const nginxRouter = require('./routes/nginxRouter.js');
const msgCtrl = require('./controllers/notificationController.js');

const app = express();
const appRedirect = express();

appRedirect.listen(8080, (err) => {
  console.log(err);
});

appRedirect.use('*', (req, res) => {
  res.writeHead(302, { 'Location': 'https://www.djdeploy.com/' });
  res.end();
});

var isDeveloping = process.env.NODE_ENV !== 'production'; // do not change this to const

//To server the bundled file in a dev environment (simulating prod environment):
//  1. run `webpack  --config webpack.production.config.js` to create the bundle in /build (20-30 sec)
//  2. set isDeveloping to false (uncomment the line below)
// isDeveloping = false;
//  3. npm start
if (isDeveloping) {
  let webpackDevMiddleware = require('webpack-dev-middleware');
  let webpackHotMiddleware = require('webpack-hot-middleware');
  let compiler = webpack(config);
  let middleware = webpackDevMiddleware(compiler, {
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
const auth = require('./auth/configRoutes');//ensureAuthenticated
require('./auth/passport')(passport); // pass passport for configuration
auth.configRoutes(app, passport); // pass app for configuration
/*================================================*/

app.use(express.static(__dirname + '/../public'));
app.use('/getStats', auth.ensureAuthenticated, getStats_controller);
app.use('/stats', stats_controller);
app.use('/user', userRouter);
app.use('/nginx', nginxRouter);

// api interface for interacting with digital_ocean, et al.
const configureRequest = require('./api/configure.js');
const makeRequest = require('./api/makeRequest.js');
const sendReply = require('./api/sendReply');
app.use('/api/:action', auth.ensureAuthenticated, configureRequest, makeRequest, sendReply);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../public/index.html'))
})

/*=============HTTPS Setup========================*/
// var LEX = require('letsencrypt-express');

// var lex = LEX.create({
//  configDir: '/etc/letsencrypt',
//  approveRegistration: function (hostname, cb) {
//    cb(null, {
//      domains: ['djdeploy.com'],
//      email: 'bresnan.mw@gmail.com',
//      agreeTos: true,
//    });
//  }
// });

// lex.onRequest = app;

// lex.listen([3000], [1337, 5001], function () {
//  var protocol = ('requestCert' in this) ? 'https': 'http';
//  console.log("Listening at " + protocol + '://localhost:' + this.address().port);
// });


module.exports = app;
