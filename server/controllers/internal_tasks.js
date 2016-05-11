"use strict";
const clientApps = require('../db/collections/client-apps');
const clientServers = require('../db/collections/client-server');
const Creds = require('../db/collections/service-creds');
const LoadBalancers = require('../db/collections/loadbalancers');
const internalRequest = require('../api/internalRequest');
const Promise = require('bluebird');
const nginxController = require('./nginxController');
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

module.exports = internalTasks;