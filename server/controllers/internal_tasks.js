"use strict";
const clientApps = require('../db/collections/client-apps');
const clientServers = require('../db/collections/client-server');
const Creds = require('../db/collections/service-creds');
const internalRequest = require('../api/internalRequest');
var internalTasks = {};

internalTasks.syncServersToPlatforms = function (userID, overwriteAll) {
  let serverQuickLookup = {};

  if (!userID) {
    return;
  }

  /* BEGIN Helper Function */
  let processServerForCreds = (cred) => {
    internalRequest.getServerList(cred)
      .then(function (data) {
        let serverList = data;

        /* build object to quickly reference retrieved servers by ip */
        for (let idx = 0; idx < serverList.servers.length; idx++) {
          let quickLook = serverQuickLookup[serverList.servers[idx].ip] = {};
          quickLook.name = serverList.servers[idx].name;
          quickLook.server_id = serverList.servers[idx].server_id;
          quickLook.platform = serverList.servers[idx].platform;
          quickLook.serviceCreds_id = cred.get('id');
          // save this somewhere?
          quickLook.platformSpecific = serverList.servers[idx].platformSpecific;
        }
        return new clientServers.model().fetchAll();
      })
      .then(function (clientServers) {
        /* update server table with retrieved information */
        clientServers.each(function (clientServer) {
          let quickLook = serverQuickLookup[clientServer.get('ip')];

          /* if the table field is not filled in or we're overwriting */
          if ((quickLook !== undefined) &&
            ((!clientServer.get('platform')) || overwriteAll)) {
            clientServer.set('platform', quickLook.platform);
            clientServer.set('server_id', quickLook.server_id);
            clientServer.set('serviceCreds_id', quickLook.serviceCreds_id);
            clientServer.save();
          }
        });
      });
  };
  /* END Helper Function */


  /* grab all credentials for user then process each */
  Creds.model.where({ users_id: userID }).fetchAll()
    .then((userCreds) => {
      userCreds.each((cred) => {
        // don't care if it was successful or not
        // just run the creds
        processServerForCreds(cred);
      });
    });
};

module.exports = internalTasks;