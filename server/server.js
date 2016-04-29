const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../webpack.config.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');


const app = express();

const compiler = webpack(config);

// if (node_env === 'DEVELOPMENT') {
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
// }

app.use(express.static('./dist'));
app.use(bodyParser.json()); // for parsing application/json

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve('./public/favicon.ico'));
});
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});


const port = 1337;

app.listen(port, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Server listening at 127.0.0.1, port:', port);
  }
});
