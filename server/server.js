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
const port = isDeveloping ? 1337 : process.env.port;

//To server the bundled file in a dev environment (simulating prod environment):
//  1. run `webpack  --config webpack.production.config.js` to create the bundle (20-30 sec)
//  2. uncomment the line below to disable webpack's dev server
     // isDeveloping = false
//  3. npm start
if (isDeveloping) {  
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(path.resolve(__dirname, '../public')));
}
/* ========================== */



// const jsonParser = bodyParser.json();
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

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('*', (request, response) => {
  console.log('directing to index');
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Server listening at 127.0.0.1, port:', port);
  }
});
