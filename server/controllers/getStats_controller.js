var clientApps = require('../db/collections/client-apps');
var clientServers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');


exports.singleServer = function(req, res) {
  //TODO change path to include server id params;
  var serverId = 1;
  // if (!id) {
  //   console.log('Error, could not get serverID', error);
  //   res.status(500).send("Error, no serverID supllied");
  //   return;
  // }

  stats.model.where('clientServers_id', serverId).fetchAll()
    .then(function(serverStats) {
      var count = 0;
      var obj = {};
      var result = [];
      serverStats.models.forEach(function(model) {
        var item = model.attributes;

        var inputObj = {
          hits: item.statValue,
          time: item.created_at
        };

        if (item.statName in obj) {
          result[obj[item.statName]].data.push(inputObj);
        } else {
          obj[item.statName] = count;
          result[count] = {
            route: item.statName.slice(1),
            data: [inputObj]
          };

        count++;
        }

      });
      res.status(200).send(result);
    })
    .catch(function(error) {
      console.error("Get stats error", error);
      res.send(500);
    });

};

