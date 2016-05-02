var clientApps = require('../db/collections/client-apps');
var clientServers = require('../db/collections/client-server');
var internalRequest = require('../api/internalRequest');
var internalTasks = {};

internalTasks.syncServersToPlatforms = function (overwriteAll) {
  var serverList = null;
  var serverQuickLookup = {};
  internalRequest.getServerList()
    .then(function (data) {
      serverList = data;
      /* build object to quickly reference retrieved servers by ip */
      for (var idx = 0; idx < serverList.servers.length; idx++) {
        var quickLook = serverQuickLookup[serverList.servers[idx].ip] = {};
        quickLook.name = serverList.servers[idx].name;
        quickLook.server_id = serverList.servers[idx].server_id;
        quickLook.platform = serverList.servers[idx].platform;
        // save this somewhere?
        quickLook.platformSpecific = serverList.servers[idx].platformSpecific;
      }
      return new clientServers.model().fetchAll();
    })
    .then(function (clientServers) {
      /* update server table with retrieved information */
      clientServers.forEach(function (clientServer) {
        var quickLook = serverQuickLookup[clientServer.attributes.ip];
        
        if ((quickLook !== undefined) &&
        ((!clientServer.attributes.platform) || overwriteAll)) {
          clientServer.attributes.platform = quickLook.platform;
          clientServer.attributes.server_id = quickLook.server_id;
          clientServer.save();
        }
      });
    });
}

module.exports = internalTasks;