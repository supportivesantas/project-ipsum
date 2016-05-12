"use strict";
var Promise = require('bluebird');
var configureRequest = require('./configure.js');
var makeRequest = require('./makeRequest');
var parse = require('./parse');
var internalRequest = {};

var configureRequestAsync = function (req) {
  return new Promise(function (resolve, reject) {
    // for this purpose we don't care about response
    // stub out the response
    var res = {
      status: () => { return res; },
      send: () => { },
      end: () => { }
    };

    configureRequest(req, res, function () {
      resolve(req);
    });
  });
};

var makeRequestAsync = function (req) {
  return new Promise(function (resolve, reject) {
    // for this purpose we don't care about response
    // stub out the response
    var res = {
      status: () => { return res; },
      send: () => { },
      end: () => { }
    };
    
    makeRequest(req, res, function () {
      resolve(req);
    });
  });
};

internalRequest.getServer = function(cred, server_id) {
  let platform = cred.get('platform');
  /* build request object */
  var req = {
    platform: platform,
    token: cred.get('value'),
    params: {
      action: 'get_server'
    },
    body: {
      username: null, // unused for now
      target_id: null, // not relevant for this request
      server_id: server_id
    }
  };
  console.log(req);
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
      console.log('ERROR: Failed inside getServer', error)
      // do nothing
    });
};

internalRequest.getServerList = function(cred) {
  let platform = cred.get('platform');
  /* build request object */
  var req = {
    platform: platform,
    token: cred.get('value'),
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

internalRequest.getServerPltfmSpecific = function (cred, server_id) {
  let platform = cred.get('platform');
  /* build request object */
  var req = {
    platform: platform,
    token: cred.get('value'),
    params: {
      action: 'get_server_pltfm_specific'
    },
    body: {
      username: null, // unused for now
      target_id: null, // not relevant for this request
      server_id: server_id
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
      console.log('ERROR: Failed inside getServerPltfmSpecific', error)
      // do nothing
    });
};

internalRequest.create_server = function (cred, pltfmSpecific) {
  let platform = cred.get('platform');
  /* build request object */
  var req = {
    platform: platform,
    token: cred.get('value'),
    params: {
      action: 'create_server'
    },
    body: {
      username: null, // unused for now
      target_id: null, // not relevant for this request
    }
  };

  /* copy all platform specific server data into request body */
  for (let prop in pltfmSpecific) {
    req.body[prop] = pltfmSpecific[prop];
  }
  
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
      console.log('ERROR: Failed inside getServerPltfmSpecific', error)
      // do nothing
    });
}

module.exports = internalRequest;