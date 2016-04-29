/*
 *
 * Example Usage
 * var app = express();
 * app.use(libstats.initClient(app, {
 *   name: 'myAppNameHere',
 *   url: 'http://localhost:1337/stats',
 *   interval: 5000 // stats reporting interval
 * }));
 *
 */

var url = require('url');
var requestP = require('request-promise');
var os = require('os');
var dns = require('dns');

exports.version = '0.0.1';

var options = {
  name: null,
  url: 'http://localhost:8000/stats',
  interval: 30000,       /* 30 seconds */
  token: '',             /*    token   */
  hostname: os.hostname(),
  ip: null,
  timeout: 10000
};

var statistics = {};

var payload = {
  hash: null,
  token: null,
  statistics: statistics
};

var logEndPoint = function (req, res, next) {
  var path = url.parse(req.url).pathname;
  
  if (!statistics[path]) {
    statistics[path] = 0;
  }

  statistics[path]++;
  next();
};

var pushStatistics = function () {
  console.log(statistics);
  payload.statistics = statistics;
  statistics = {};
  requestP({
    url: options.url,
    method: "POST",
    json: true,
    body: payload,
    timeout: options.timeout
  })
    .then(function (response) {
      setTimeout(pushStatistics, options.interval);
      return;
    })
    .catch(function (error) {
      if (error.statusCode !== 500) {
        /* maybe controller went offline try again */
        console.log('Error: Cannot Connect to Controller.  Trying to re-register');
        registerClient();
      } else {
        /* if statusCode is 500 then there's something wrong with token? *
         * try again in 10 minutes                                       */
        console.log('Critical Error: Retrying Registration in 10 minutes.  Check your token.');
        setTimeout(pushStatistics, 600000);
      }
    });
};

var registerClient = function () {
  console.log('Trying to Register Client');

  var registerInfo = {
    ip: options.ip,
    hostname: options.hostname,
    appname: options.name
  };

  requestP({
    url: options.url + '/register',
    method: "POST",
    json: true,
    body: registerInfo,
  })
    .then(function (response) {
      console.log('Successfully Registered Client');
      
      /* start monitoring */
      payload.hash = response;
      setTimeout(pushStatistics, options.interval);
    })
    .catch(function (error) {
      if (error.statusCode === 500) {
        /* failed to register client just bail */
        console.log('Registration Failure');
        return;
      } else {
        /* other error  */
        console.log('Registration Failure.  Retrying...');
        setTimeout(registerClient, 5000);
      }
    });
};

exports.initClient = function (app, opts) {
  var ipDefined = false;
  
  for (var props in opts) {
    if (options[props] !== undefined) {
      options[props] = opts[props];
    }
  }

  /* copy options to payload */
  for (var props in payload) {
    if (options[props] && props !== 'statistics') {
      payload[props] = options[props];
    }
  }

  /* get ip of first interface */
  if (!options.ip) {
    dns.lookup(options.hostname, function (err, address, family) {
      options.ip = address;
      registerClient();
    });
  } else {
    ipDefined = true;
  }
  
  if (ipDefined) {
    registerClient();
  }
  
  return logEndPoint;
};
