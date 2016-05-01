var clientApps = require('../db/collections/client-apps');
var clientServers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');


exports.singleServer = function(req, res) {
  // var serverId = req.params.id;
  // console.log("THis is server id" + serverId)
  // if (!id) {
  //   console.log('Error, could not get serverID', error);
  //   res.status(500).send("Error, no serverID supllied");
  //   return;
  // }

  stats.model.where('clientServers_id', 1).fetchAll()
    .then(function(serverStats) {
      console.log("SERVER STATSSS", serverStats);
      res.status(200).send(serverStats);
    })
    .catch(function(error) {
      console.error("Get stats error", error);
      res.send(500);
    });

};

