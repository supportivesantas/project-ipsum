/*
 *
 * Example Usage
 * var app = express();
 * app.use(libstats.initClient(app, {
 *   url: 'localhost:8080',
 *   interval: 30000
 * }));
 *
 */

var url = require('url');

exports.version = '0.0.1';

var statistics = {};
var options = {
  url: 'localhost:8000',
  interval: 30000,       /* 30 seconds */
  token: '',             /*    token   */
  intervalID: null
};

var logEndPoint = function (req, res, next) {
  var path = url.parse(req.url).pathname;
  
  if (path.substr(-1) === '/') {
    path = path.substr(0, path.length - 1);
  }
  
  if (!statistics[path]) {
    statistics[path] = 0;
  }

  statistics[path]++;
  next();
};

var pushStatistics = function () {
  /* fill in later with stuff to send to controller */
  console.log(statistics);
};

exports.initClient = function (app, opts) {
  // init stuff here?
  for (var props in opts) {
    if (options[props] !== undefined) {
      options[props] = opts[props];
    }
  }
  options.intervalID = setInterval(pushStatistics, options.interval);
  return logEndPoint;
};
