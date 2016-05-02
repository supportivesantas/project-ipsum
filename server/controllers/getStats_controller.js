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

  //TODO: narrow down search for only entries from last ~6hours/// OR for summary information/ day, week, month, etc;
  //TODO: Add 'total' obj to front of array, total hits for all
  stats.model.where('clientServers_id', serverId).fetchAll()
    .then(function(serverStats) {
      var count = 0;
      var routes = {};
      var graphData = [];
      serverStats.models.forEach(function(model) {
        var routeDataPoint = model.attributes;

        var routeData = {
          hits: routeDataPoint.statValue,
          time: routeDataPoint.created_at
        };

        if (routeDataPoint.statName in routes) {
          graphData[routes[routeDataPoint.statName]].data.push(routeData);
        } else {
          routes[routeDataPoint.statName] = count;
          graphData[count] = {
            route: routeDataPoint.statName.slice(1),
            data: [routeData]
          };
        count++;
        }

      });
      res.status(200).send(graphData);
    })
    .catch(function(error) {
      console.error("Get stats error", error);
      res.send(500);
    });

};

