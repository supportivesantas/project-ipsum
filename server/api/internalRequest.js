var Promise = require('bluebird');
var configureRequest = require('./configure.js');
var makeRequest = require('./makeRequest');
var parse = require('./parse');
var internalRequest = {};

var configureRequestAsync = function (req) {
  return new Promise(function (resolve, reject) {
    // for this purpose we don't care about response
    var res = {};
    
    configureRequest(req, res, function () {
      resolve(req);
    });
  });
};

var makeRequestAsync = function (req) {
  return new Promise(function (resolve, reject) {
    // for this purpose we don't care about response
    var res = {};
    
    makeRequest(req, res, function () {
      resolve(req);
    });
  });
};

internalRequest.getServerList = function(user) {
  // do something with user to get all creds
  // then loop thru all creds to get entire list
  /* build request object */
  var req = {
    platform: 'digital_ocean', // should come from db
    params: {
      action: 'list_all_servers'
    },
    body: {
      username: null, // unused for now
      target_id: null // not relevant for this request
    }
  };
  
  var res = {};
  
  // simulate express call flow
  return configureRequestAsync(req)
    .then(function (req) {
      return makeRequestAsync(req);
    })
    .then(function (req) {
      return parse(req.params.action, req.platform, req.resp);
    })
    .catch(function (error) {
      console.log('ERROR: Failed inside getServerList', error)
      // do nothing
    });
};

module.exports = internalRequest;