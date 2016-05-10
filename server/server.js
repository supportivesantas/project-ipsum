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

//add this middleware to protected routes. redirects to github login page if not authenticated
const ensureAuthenticated = require('./auth/passport.js').ensureAuthenticated;

const app = express();

const compiler = webpack(config);

if (process.env.NODE_ENV !== 'production') {
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// const jsonParser = bodyParser.json();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

/*======== GITHUB AUTHENTICATION SETUP ===========*/
const passport = require('passport');
const configRoutes = require('./auth/configRoutes');//ensureAuthenticated
require('./auth/passport')(passport); // pass passport for configuration
configRoutes.configRoutes(app, passport); // pass app for configuration
/*================================================*/

app.use(express.static('./dist'));
app.use('/getStats', /*configRoutes.ensureAuthenticated,*/ getStats_controller);
app.use('/stats', stats_controller);
app.use('/user', /*configRoutes.ensureAuthenticated,*/ userRouter);
app.use('/nginx', nginxRouter);

// api interface for interacting with digital_ocean, et al.
const configureRequest = require('./api/configure.js');
const makeRequest = require('./api/makeRequest.js');
const sendReply = require('./api/sendReply');
app.use('/api/:action', configureRequest, makeRequest, sendReply);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('*', (request, response) => {
  console.log('directing to index');
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

module.exports = app;
