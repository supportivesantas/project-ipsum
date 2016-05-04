var clientApps = require('../db/collections/client-apps');
var clientServers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var _ = require('underscore');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});


exports.singleServer = function(req, res) {
  var serverId = req.body.serverId || 1; //TODO: leave until server IDs are fixed
  hoursvar = req.body.hours || 12; //default to last twelve hours
  var dataRange = _.range(hoursvar + 1);

  if (!serverId) {
    console.log('Error, could not get serverID', error);
    res.status(500).send("Error, no serverID supllied");
    return;
  }

  stats.model.where('clientServers_id', serverId)
  .fetchAll()
  //get all routes to fill data points if no activity in the hours requested
    .then(function(serverRoutesByStamp) {
      var routeByStamp = serverRoutesByStamp.models;
      var allRoutes = { Total: { route: 'Total', data: [] } };
      routeByStamp.forEach(function(hit) {
        allRoutes[hit.attributes.statName.slice(1)] = { route: hit.attributes.statName.slice(1), data: [] };
      });
      return allRoutes;
    })
    .then(function(allRoutes) {
      //get hits for the specified time interval
      stats.model.where('clientServers_id', serverId)
      .where(knex.raw("created_at > (NOW() - INTERVAL '" + hoursvar + " hour'" + ")"))
      .fetchAll()
        .then(function(serverStats) {
          var models = serverStats.models;
          var graphData = [];
          // if no hits for all routes populate with data, hits = 0
          if (!models.length) {
            var tempArr = [];
            dataRange.forEach(function(i) {
              tempArr.push({time: i, hits: 0});
            });
            for (var route in allRoutes) {
              allRoutes[route].data = tempArr;
              graphData.push(allRoutes[route]);
            }
          } else {
            var totalHits = {};
            models.forEach(function(model) {
              var route = model.attributes;
              //put together all data with time: hours ago from now     (below): floor or ciel??
              allRoutes[route.statName.slice(1)].data.push({
                  time: Math.floor(Math.abs(route.created_at - Date.now()) / 36e5),
                  hits: route.statValue
                });
            });
            //Compile hits and add missing dataPoints for each route
            _.each(allRoutes, function(route) {
              var routeHits = {};
              _.each(route.data, function(hitObj) {
                if (!routeHits[hitObj.time]) {
                  routeHits[hitObj.time] = hitObj.hits;
                } else {
                  routeHits[hitObj.time] += hitObj.hits;
                }
                if (!totalHits[hitObj.time]) {
                  totalHits[hitObj.time] = hitObj.hits;
                } else {
                  totalHits[hitObj.time] += hitObj.hits;
                }
              });
              route.data = [];
              for (var time in routeHits) {
                route.data.push({time: +time, hits: routeHits[time]});
              }
              _.each(dataRange, function(i) {
                if (!routeHits[i]) {
                  route.data.push({time: i, hits: 0 });
                }
              });
            });
            //Compile Total Hits
            _.each(allRoutes.Total.data, function(dataPoint) {
              if (totalHits[dataPoint.time]) {
                dataPoint.hits = totalHits[dataPoint.time];
              }
            });
          }
          //Put into graphData Array
          for (var aRoute in allRoutes) {
            graphData.push(allRoutes[aRoute]);
          }

          res.send(graphData);
        })
        .catch(function(error) {
          console.error("Get stats error", error);
          res.send(500);
        });
    });
};

