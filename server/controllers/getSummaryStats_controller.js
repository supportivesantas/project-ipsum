var AppSums = require('../db/collections/appsummaries.js');
var ServerSums = require('../db/collections/serversummaries.js');
var Hash = require('../db/collections/hashes.js');
var _ = require('underscore');
var Promise = require('bluebird');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});


//TODO: Reformat allAppSummaries to include seven day graph data, (x=date, y=totalHits), and total routes
exports.allAppSummaries = function(req, res) {
  AppSums.model.fetchAll()
  .then(function(appSummaries) {
    var appRoutes = appSummaries.models;
    var apps = {};
    var totalRoutes = {};
    var createAppObj = (appid, date, routes, hits) => {
      var result = {};
      result.appid = appid;
      result.date = date;
      result.totalRoutes = routes;
      result.totalHits = hits;
      return result;
    };
    _.each(appRoutes, (appRoute) => {
      appRoute = appRoute.attributes;
      var appId = appRoute.appid;
      var id = "id"+ appId + appRoute.created_at.getDay();
      if (!apps[id]) {
        apps[id] = {
          appid: appId,
          date: appRoute.created_at,
          allRoutes: { length: 0 },
          hits: +appRoute.value
        };
      } else {
        apps[id].hits += +appRoute.value;
      }
      if(!apps[id].allRoutes[appRoute.route]) {
        apps[id].allRoutes[appRoute.route] = appRoute.route;
        apps[id].allRoutes.length++;
      }
    });

    var compiledApps = {};
    _.each(apps, function(app) {
      compiledApps[app.appid] = (createAppObj(app.appid, app.date, app.allRoutes.length, app.hits));
    });
    //STILL MORE COMPILING FOR GRAPH, PUT DAYS TOGETHER OF XY PLoTS
    res.send(compiledApps);
  })
  .catch(function(error) {
    console.log('Error getting all App Summaries', error);
    res.send(500);
  });
};

//TODO: MyServerSummary, basically the inverse of myAppSummary
exports.myServerSummary = function(req, res) {
//WILL BE FOR INDIVIDUAL SERVERS ON MY SERVER PAGE
//Filter By User ID and SERVER ID and have req.body for time interval (1-30 days)
  ServerSums.model.fetchAll()
  .then(function(serverSummary) {
    // console.log(serverSummary);
    res.send(serverSummary.models);
  })
  .catch(function(error) {
    console.log('Error getting server summary', error);
    res.send(500);
  });
};

exports.myAppSummary = (req, res) => {
//update to req.body variables below
  var userId = 1;
  var appId = 1;
  var days = 2;
  //appRoutes defined in this scope so servers can cross reference and total up just the hits for this app.
  //Assumes apps do not share route names, only way to pull out app hits for each server
  //Server summaries is totaled by route not by app (so would need to let customers know routes must be unique across apps)
  var appRoutes = {};
 AppSums.model.where({'users_id': userId, 'appid': appId })
 .where(knex.raw("created_at > (NOW() - INTERVAL '" + (days * 24) + " hour'" + ")"))
  .fetchAll()
  .then(function(appSummary) {
    appModels = appSummary.models;
    //Object to keep track of total hits for each day
    var appTotalHits = {};
    //Sort each route, with sorted dates within each route
    //ie. appRoutes = { route: {dateid:[routeModel, routeModel ...], dateid: []...}, route: {}... }
    _.each(appModels, (appModel) => {
      appRoute = appModel.attributes;
      var dateId = appRoute.day + appRoute.month + appRoute.year;
      //Initialize Totals for each date
      if (!appTotalHits[dateId]) {
        //=====Change to timestamp or days ago, currently day+month+year (ie '852016' for may 8 2016)?
        appTotalHits[dateId] = 0;
      }
      //Sorting by route and date
      var routeName = appRoute.route;
      if (!appRoutes[routeName]) {
        appRoutes[routeName] = {};
        appRoutes[routeName][dateId] = [appRoute];
      } else if (appRoutes[routeName] && !appRoutes[routeName][dateId]) {
        appRoutes[routeName][dateId] = [appRoute];
      } else {
        appRoutes[appId][dateId].push(appRoute);
      }
    });
    //For each route, compile total hits for each day within
    var appRouteSums = [];
    //Go through Routes
    _.each(appRoutes, (appRoute) => {
      var routeDateSum = [];
      //Go through each day
      _.each(appRoute, (routeDateArr) => {
        //Total up all hits for each day
        var totalHits = _.reduce(routeDateArr, (memo, routeDate) => {
          return memo + +routeDate.value;
        }, 0);
        //======DAYS AGO GO HERE??
        var date = routeDateArr[0].day + routeDateArr[0].month + routeDateArr[0].year;
        appTotalHits[date] += totalHits;
        routeDateSum.push({route: routeDateArr[0].route, date: date, timestamp: routeDateArr[0].created_at, totalHits: totalHits});
      });
      appRouteSums.push({route: routeDateSum[0].route, data: routeDateSum});
    });
    //Create response object with data available so far
    var appCompleteSummary = {
      Total : appTotalHits,
      Routes: appRouteSums,
      Servers: null,
    };
    return appCompleteSummary;
  })
  .then((appCompleteSummary) => {
    //Find all servers belonging to this app
    Hash.model.where({'users_id': userId, 'clientApps_id': appId })
      .fetchAll()
      .then((appServers) => {
        var appServerModels = appServers.models;
        //Put all server ids in an array to iterate over
        var getAppServersIds = [];
        _.each(appServerModels, (appServer) => {
          getAppServersIds.push(appServer.attributes.clientServers_id);
        });
        //Create an array of queries to pull summaries for each server belonging to this app
        var promises = _.map(getAppServersIds, (serverId) => {
          return ServerSums.model.where({'users_id': userId, 'serverid': serverId })
                  .where(knex.raw("created_at > (NOW() - INTERVAL '" + (days * 24) + " hour'" + ")"))
                  .fetchAll()
                  .then((serverSumPromises) => {
                    return serverSumPromises;
                  })
                  .catch((error) => {
                    console.error("Error in finding server summaries", error);
                  });
        });
        //Promise all to properly wait for array of promises to resolve
        return Promise.all(promises).then((serverSummariesPromise) => {
          return serverSummariesPromise;
      })
      .then((serverSummaries) => {
        //Sort each server, with sorted dates within:
        //ie. appServers = { serverId: {dateid:[serverModel, serverModel ...], dateid: []...}, serverId: {}... }
        var appServers = {};
        _.each(serverSummaries, (serverArr) => {
          _.each(serverArr.models, (server) => {
            var serverModel = server.attributes;
            //If route does not belonge to this app, skip it
            if (!appRoutes[serverModel.route]) { return; }
            //Sort by server and date
            var dateId = serverModel.day + serverModel.month + serverModel.year;
            var serverId = serverModel.serverid;
            if (!appServers[serverId]) {
              appServers[serverId] = {};
              appServers[serverId][dateId] = [serverModel];
            } else if (appServers[serverId] && !appServers[serverId][dateId]) {
              appServers[serverId][dateId] = [serverModel];
            } else {
              appServers[serverId][dateId].push(serverModel);
            }
          });
        });
        //Compile total hits for each day and format for graphs
        var appServerSums = [];
        _.each(appServers, (appServer) => {
          var serverDateSum = [];
          _.each(appServer, (serverDateArr) => {
            var totalHits = _.reduce(serverDateArr, (memo, serverDate) => {
              return memo + +serverDate.value;
            }, 0);
            //=====DAYS AGO GO HERE??
            var date = serverDateArr[0].day + serverDateArr[0].month + serverDateArr[0].year;
            serverDateSum.push({serverid: serverDateArr[0].serverid, date: date, timestamp: serverDateArr[0].created_at, totalHits: totalHits});
          });
          appServerSums.push({server: serverDateSum[0].serverid, data: serverDateSum});
        });
        //Add server summaries to response object before sending
        appCompleteSummary.Servers = appServerSums;
        res.send(appCompleteSummary);
      });
    });
  })
  .catch(function(error) {
    console.log('Error getting app summary', error);
    res.send(500);
  });
};

