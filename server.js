const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const config = require('./webpack.config.js');
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

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve('./public/favicon.ico'));
});
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

app.listen(1337);
