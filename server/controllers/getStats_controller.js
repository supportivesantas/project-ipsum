var clientApps = require('../db/collections/client-apps');
var clientServer = require('../db/models/client-server');
var clientServers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var _ = require('underscore');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

exports.formatDataByHour = function(allRoutes, serverStats, dataRange) {
    // if no hits for all routes populate with data, hits = 0
  var models = serverStats.models;
  var graphData = [];
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
          time: Math.ceil(Math.abs(route.created_at - Date.now()) / 36e5),
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
    //sort data points, matters for D3
    _.each(allRoutes, function(route) {
      route.data = _.sortBy(route.data, 'time');
    });
  }
  //Put into graphData Array
  for (var aRoute in allRoutes) {
    graphData.push(allRoutes[aRoute]);
  }
  return graphData;
};

exports.singleApp = function(req, res) {
  var appId = req.body.appId || 3; //TODO: leave until server IDs are fixed
  var hoursvar = req.body.hours || 12; //default to last twelve hours
  var dataRange = _.range(hoursvar + 1);
 // var userId = req.user.id;//======================================================Put check in Later

  if (!appId) {
    console.log('Error, could not get appID', error);
    res.status(500).send("Error, no appID supplied");
    return;
  }

  stats.model.where('clientApps_id', appId)
  .fetchAll()
  //get all routes to fill data points if no activity in the hours requested
    .then(function(appRoutesByStamp) {
      var routeByStamp = appRoutesByStamp.models;
      var allRoutes = { Total: { route: 'Total', data: [] } };
      routeByStamp.forEach(function(hit) {
        allRoutes[hit.attributes.statName.slice(1)] = { route: hit.attributes.statName.slice(1), data: [] };
      });
      return allRoutes;
    })
    .then(function(allRoutes) {
      //get hits for the specified time interval
      stats.model.where('clientApps_id', appId)
      .where(knex.raw("created_at > (NOW() - INTERVAL '" + hoursvar + " hour'" + ")"))
      .fetchAll()
        .then(function(serverStats) {
          var response = exports.formatDataByHour(allRoutes, serverStats, dataRange);
          res.send(response);
        })
        .catch(function(error) {
          console.error("Get stats error", error);
          res.send(500);
        });
    });
};


exports.singleServer = function(req, res) {
  var serverId = req.body.serverId || 1; //TODO: leave until server IDs are fixed
  var hoursvar = req.body.hours || 12; //default to last twelve hours
  var dataRange = _.range(hoursvar + 1);

  if (!serverId) {
    console.log('Error, could not get serverID', error);
    res.status(500).send("Error, no serverID supplied");
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
          var response = exports.formatDataByHour(allRoutes, serverStats, dataRange);
          res.send(response);
        })
        .catch(function(error) {
          console.error("Get stats error", error);
          res.send(500);
        });
    });
};

exports.serverTotalsForApp = function(req, res, next) {
  // check if appname or appid is specified
  var appname = req.body.appname;
  var appid = req.body.appid;
  var hoursvar = req.body.hours || 168;
  // var userid = req.user.id;

  if (!req.body.appname && ! req.body.appid) {
    var message = 'Bad Request! No appname or appid supplied';
    console.log(message);
    res.status(400).send(message);
    return;
  }

  var getStatsWithAppId = function(appid) {
    // get stats for this app with a valid appid
    stats.model.where({clientApps_id: appid})
    .where(knex.raw("created_at > (NOW() - INTERVAL '" + hoursvar + " hour'" + ")"))
    .fetchAll()
    .then(function(data) {
      console.log('Application stats request received. Processing...');

      var serverStats = {}; // the results that will eventuall be send back
      var serverIds = []; // store server ids for which we need to look up hostnames & ips

      data.forEach(function(stat, idx, data) {
        var id = stat.get('clientServers_id');
        if (!serverStats.hasOwnProperty(id)) {
          // initialize a server object. keys will be added for the ip and hostname (see below)
          serverStats[id] = {ip: null, hostname: null, statValue: 0};
          serverIds.push(id);
        } else {
          // server hostname and ip already exist in our results, so just increment
          serverStats[id].statValue += stat.get('statValue');
        }
      });

      knex('clientServers')
      .select('id', 'ip', 'hostname')
      .whereIn('id', serverIds)
      .then(function(serversData) {
        serversData.forEach(function(serverInfo) {
          serverStats[serverInfo.id].ip = serverInfo.ip;
          serverStats[serverInfo.id].hostname = serverInfo.hostname;
        });
        res.status(200).json(serverStats);
        console.log('Done processing.')
      })
      .catch(function(err) {
        var message = 'Error while processing server totals. ';
        console.log(message, err);
        res.status(500).send(message)
      });

    })
    .catch(function(err){
      var message = 'Error while fetching app stats from database. ';
      console.log(err);
      res.status(500).send(message);
    });
  }

  // fetch the appid from the db if only the appname is supplied
  if (!appid && appname) {
    clientApps.model.where('appname', appname)
    .fetch()
    .then(function(appObject) {
      appid = appObject.id;
      getStatsWithAppId(appid);
    })
    .catch(function(err) {
      var message = 'Bad Request! Could not find an application with the supplied information. ';
      console.log(message, err);
      res.status(400).send(message);
      return;
    });
  } else {
    getStatsWithAppId(appid);
  }
}

