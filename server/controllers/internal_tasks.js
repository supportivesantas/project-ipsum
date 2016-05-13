"use strict";
const clientApps = require('../db/collections/client-apps');
const clientServers = require('../db/collections/client-server');
const Creds = require('../db/collections/service-creds');
const LoadBalancers = require('../db/collections/loadbalancers');
const Users = require('../db/collections/users.js');
const internalRequest = require('../api/internalRequest');
const requestP = require('request-promise');
const Promise = require('bluebird');
const nginxController = require('./nginxController');
const configureRequest = require('../api/configure.js');
var internalTasks = {};

internalTasks.syncServersToPlatforms = function (userID, overwriteAll) {
  let credArray = [];
  let serverQuickLookup = {};

  if (!userID) {
    throw 'ERROR: userID not defined in syncServersToLB';
  }

  /* grab all credentials for user then process each */
  return Creds.model.where({ users_id: userID }).fetchAll()
    .then((userCreds) => {
      credArray = userCreds;
      return Promise.all(userCreds.map((cred) => {
        return internalRequest.getServerList(cred);
      }));
    })
    .then((serverLists) => {
      serverLists.forEach((serverList, serverIdx) => {
        /* build object to quickly reference retrieved servers by ip */
        for (let idx = 0; idx < serverList.servers.length; idx++) {
          let quickLook = serverQuickLookup[serverList.servers[idx].ip] = {};
          quickLook.name = serverList.servers[idx].name;
          quickLook.server_id = serverList.servers[idx].server_id;
          quickLook.platform = serverList.servers[idx].platform;
          quickLook.serviceCreds_id = credArray.at(serverIdx).get('id');
          // save this somewhere?
          quickLook.platformSpecific = serverList.servers[idx].platformSpecific;
        }
      });
      return new clientServers.model().fetchAll();
    })
    .then(function (clientServers) {
      /* update server table with retrieved information */
      return Promise.all(clientServers.map(function (clientServer) {
        let quickLook = serverQuickLookup[clientServer.get('ip')];

        /* if the table field is not filled in or we're overwriting */
        if ((quickLook !== undefined) &&
          ((!clientServer.get('platform')) || overwriteAll)) {
          clientServer.set('platform', quickLook.platform);
          clientServer.set('server_id', quickLook.server_id);
          clientServer.set('serviceCreds_id', quickLook.serviceCreds_id);
          return clientServer.save();
        } else {
          return;
        }
      }));
    })
    .catch((error) => {
      console.log(error);
    });
};

internalTasks.syncServersToLB = function (userID, overwriteAll) {
  let lbArray = [];
  let quickLook = {};

  if (userID === undefined) {
    throw 'ERROR: userID not defined in syncServersToLB';
  }
  
  return LoadBalancers.model.where({ users_id: userID }).fetchAll()
    .then((LBs) => {
      lbArray = LBs;
      
      return Promise.all(LBs.map((LB) => {
        let ip = LB.get('ip');
        let port = LB.get('port');
        let zone = LB.get('zone');
        
        let host = ip + ':' + port;
        /* make this generic later for other load balancers */
        return nginxController.listParsed(host, zone);
      }));
    })
    .then((results) => {
      
      /* modify server object for each LB attaching LB id */
      results.forEach((LB, lbIdx) => {
        LB.forEach((server) => {
          server.lbID = lbArray.at(lbIdx).get('id');
          quickLook[server.ip] = server;
        });
      });

      return clientServers.model.where({ users_id: userID }).fetchAll();
    })
    .then((servers) => {
      return Promise.all(servers.map((server) => {
        if (quickLook[server.get('ip')] && (!server.get('master') || overwriteAll)) {
          server.set('master', quickLook[server.get('ip')].lbID);
          return server.save();
        } else {
          return;
        }
      }));
    })
    .catch((error) => {
      console.log(error);
    });


};

// must create server based off an existing one with image id
internalTasks.createServer = function (userID, serverID, image_id) {
  let server_id = null;
  let credsID = null;
  let cred = null;
  let pltfmSpecifc = null;
  let name = null;
  console.log('inside createServer');
  if (userID === undefined || serverID === undefined) {
    return null;
  }

  // get the platform specific server_id for serverID
  return clientServers.model.where({
    users_id: userID,
    id: serverID
  }).fetch()
    .then((clientServer) => {
      server_id = clientServer.get('server_id');
      credsID = clientServer.get('serviceCreds_id');
      
      return Creds.model.where({
        users_id: userID,
        id: credsID
      }).fetch();
    })
    .then((userCred) => {
      cred = userCred;
      // get server platform specific info
      return internalRequest.getServerPltfmSpecific(cred, server_id);
    })
    .then((result) => {
      // save platform specific info for this server
      pltfmSpecifc = result.server;
      // generate new name
      pltfmSpecifc.name = pltfmSpecifc.name + '-ASCALE-' + Math.floor(Math.random() * 1000).toString();
      pltfmSpecifc.image_id = image_id;
      return internalRequest.create_server(cred, pltfmSpecifc);
    })
    .catch((error) => {
      console.log(error);
    });
};


var spinServerHelper = function (cred, server_id) {
  return new Promise(function (resolve, reject) {
    var intervalID = null;
    var numTries = 0;
    var checkIPReady = function () {
      console.log('checking if server ip is ready');
      internalRequest.getServer(cred, server_id)
        .then((result) => {
          if (result.server.ip) {
            resolve(result);
          } else if (numTries++ > 24) {
            reject('Did not detect server IP within 2 minutes');
          } else {
            setTimeout(checkIPReady, 5000);
          }
        });
    };
    setTimeout(checkIPReady, 5000);
  });
};

internalTasks.spinUpServerInLB = function (userID, lbID) {
  let self = this;
  let spin_server_id = null;
  let spin_serverID = null;
  let cred = null;
  let credsID = null;
  
  return LoadBalancers.model.where({
    users_id: userID,
    id: lbID
  }).fetch()
    .then((LB) => {
      let ip = LB.get('ip');
      let port = LB.get('port');
      let zone = LB.get('zone');

      let host = ip + ':' + port;
      /* make this generic later for other load balancers */
      return nginxController.listParsed(host, zone);
    })
    .then((nginxHosts) => {
      if (!nginxHosts || nginxHosts.length === 0) {
        throw 'ERROR: No nginx hosts received';
      }
      
      let lbIPs = [];
      for (let nginxHost of nginxHosts) {
        lbIPs.push(nginxHost.ip);
      }
      console.log(lbIPs);
      return clientServers.model.query((qb) => {
        qb.where('users_id', userID);
        qb.whereIn('ip', lbIPs);
      }).fetch();
    })
    .then((server) => {
      if (!server || server.length === 0) {
        throw 'ERROR: no servers in LB found';
      }
      let serverID = server.get('id');
      credsID = server.get('serviceCreds_id');
      console.log('creating server');
      return self.createServer(userID, serverID, 16539246);
    })
    .then((server) => {
      console.log('loaded new server');
      spin_server_id = server.server.server_id;
      return Creds.model.where({
        users_id: userID,
        id: credsID
      }).fetch();
    })
    .then((userCred) => {
      cred = userCred;
      return spinServerHelper(cred, spin_server_id);
    })
    .then((server) => {
      let ip = server.server.ip;
      let hostname = server.server.name;
      console.log('got server ip: ' + ip);
      return new clientServers.model({
          users_id: userID,
          ip: ip,
          hostname: hostname
        }).save();
    })
    .then((clientServer) => {
      spin_serverID = clientServer.id;
      return;
    })
    .catch((error) => {
      console.log(error);
    });
};

internalTasks.unhookAndDestoryServer = function(lbID, cb) {
  // this function combines .unhookServer and .destroyServer (both promises)
  return internalTasks.unhookServer(lbID)
    .then(function(serverIP) {
      return internalTasks.destroyServer(serverIP)
    })
    .then(function(res) {
      console.log('Server removed from LB and destroyed. Message:', res);
      cb(null, res);
    })
    .catch(function(err){
      console.log('Error during unhookAndDestoryServer:', err);
      cb(err);
    });
}


internalTasks.unhookServer = 
Promise.promisify(function (lbID, cb) {
  var length = null, removedIP = null, LB = null;
  // the ngingx lb tells us which server was unhooked
  return LoadBalancers.model.where({id: lbID}).fetch()
  .then(function(lb) {
    // hold a ref to the load balancer
    LB = lb;
    // returns a list of servers hooked up to lb
    return nginxController.listParsed(lb.get('ip') + ':' + lb.get('port'), lb.get('zone'));
  })
  .then(function(list){
    length = list.length; 
    console.log('LB list is:', list, '\n');
    if (length === 1) { throw new Error('Aborting unhookAndDestory: only one slave left on this load balancer!') }
    if (length === 0) { throw new Error('No servers on this LB to unhook'); }
    // choose the last one from the list to remove
    var id = Number(list[length - 1].id);
    removedIP = list[length - 1].ip;
    return nginxController.remove(LB.get('ip') + ':' + LB.get('port'), LB.get('zone'), id);
  })
  .then(function(newList){
    console.log('Newlist is:', newList, '\n');
    if (newList.length < length) {
      cb(null, removedIP);
    } else {
      throw new Error('Unsuccessful removal from load balancer');
    }
  })
  .catch(function(err) {
    console.log('Error while trying to unhook server from lb:', err)
    cb(err);
  });
});


var DOconfig = require('../api/platformConfigs/digitalOceanConfig.js');

internalTasks.destroyServer  = 
Promise.promisify(function (serverIP, cb) {
  var req = {};
  var serverModel = null;
  console.log('Attempting to destroy server with IP:', serverIP);

  // grab the token associated with this server
  return clientServers.model.where({ip: serverIP}).fetch()
  .then(function(server){
    if (!server) { throw new Error('Server with this IP could not be found in db')}
    // save a ref to model to destroy later
    serverModel = server;
    // simulate a call to our frontend api
    console.log('server id is:', server.get('server_id'))
    if (!server.get('server_id')) { throw new Error('platform server_id of this server not in db')}
    req.body = {server_id: server.get('server_id')};
    DOconfig.actions.delete_server(req);

    return Creds.model.where({id: server.get('serviceCreds_id')}).fetch()
    .then(function(cred) {
      req.token = cred.get('value');
      if (!req.token) { throw new Error('No token found for this server! Aborting destroyServer()')}
      DOconfig.authorize(req);
      // send the destroy command to the platform
      return requestP(req.options)
    })
    .then(function(resp) {
      return server.destroy().then(function() {
        console.log('Server deleted from db')
        cb(null, resp);
      })
      .catch(function(err) {
        console.log('Error while trying to delete server from db:', err)
      })
    })
    .catch(function(err) {
      console.log('Error while trying to send a destroy command to platform');
      cb(err);
    });
  }); 
});

internalTasks.attachServerLB = function (userID, serverID, lbID) {
  
};

internalTasks.removeServerLB = function (userID, serverID, lbID) {
  
};

internalTasks.checkThreshold = function (userID, serverID) {
  
};


module.exports = internalTasks;