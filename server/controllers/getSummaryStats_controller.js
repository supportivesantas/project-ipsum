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
exports.myServerSummary = (req, res) => {
//update to req.body variables below
  var userId = 1;
  var serverId = 1;
  var days = 2;

  var serverRoutes = {};
 ServerSums.model.where({'users_id': userId, 'serverid': serverId })
 .where(knex.raw("created_at > (NOW() - INTERVAL '" + (days * 24) + " hour'" + ")"))
  .fetchAll()
  .then(function(serverSummary) {
    serverModels = serverSummary.models;
    //Object to keep track of total hits for each day
    var serverTotalHits = {};
    //Sort each route, with sorted dates within each route
    //ie. serverRoutes = { route: {dateid:[routeModel, routeModel ...], dateid: []...}, route: {}... }
    _.each(serverModels, (serverModel) => {
      serverRoute = serverModel.attributes;
      var dateId =  serverRoute.year +
        (serverRoute.month.length > 1 ? serverRoute.month : '0' + serverRoute.month) +
        (serverRoute.day.length > 1 ? serverRoute.day : '0' + serverRoute.day);
      //Initialize Totals for each date
      if (!serverTotalHits[dateId]) {
        serverTotalHits[dateId] = 0;
      }
      //Sorting by route and date
      var routeName = serverRoute.route;
      if (!serverRoutes[routeName]) {
        serverRoutes[routeName] = {};
        serverRoutes[routeName][dateId] = [serverRoute];
      } else if (serverRoutes[routeName] && !serverRoutes[routeName][dateId]) {
        serverRoutes[routeName][dateId] = [serverRoute];
      } else {
        serverRoutes[serverId][dateId].push(serverRoute);
      }
    });
    //For each route, compile total hits for each day within
    var serverRouteSums = [];
    //Go through Routes
    _.each(serverRoutes, (serverRoute) => {
      var routeDateSum = [];
      //Go through each day
      _.each(serverRoute, (routeDateArr) => {
        //Total up all hits for each day
        var totalHits = _.reduce(routeDateArr, (memo, routeDate) => {
          return memo + +routeDate.value;
        }, 0);
        var date = routeDateArr[0].year +
          (routeDateArr[0].month.length > 1 ? routeDateArr[0].month : '0' + routeDateArr[0].month) +
          (routeDateArr[0].day.length > 1 ? routeDateArr[0].day : '0' + routeDateArr[0].day);
        serverTotalHits[date] += totalHits;
        routeDateSum.push({route: routeDateArr[0].route, date: date, timestamp: routeDateArr[0].created_at, value: totalHits});
      });
      serverRouteSums.push({route: routeDateSum[0].route, data: routeDateSum});
    });
    //Create response object with data available so far
    var serverCompleteSummary = {
      Total : serverTotalHits,
      Routes: serverRouteSums,
      Apps: null,
    };
    return serverCompleteSummary;
  })
  .then((serverCompleteSummary) => {
    //Find all apps belonging to this server
    Hash.model.where({'users_id': userId, 'clientServers_id': serverId })
      .fetchAll()
      .then((serverApps) => {
        var serverAppModels = serverApps.models;
        //Put all app ids in an array to iterate over
        var getServerAppsIds = [];
        _.each(serverAppModels, (serverApp) => {
          getServerAppsIds.push(serverApp.attributes.clientApps_id);
        });
        //Create an array of queries to pull summaries for each app belonging to this server
        var promises = _.map(getServerAppsIds, (appId) => {
          return AppSums.model.where({'users_id': userId, 'appid': appId })
                  .where(knex.raw("created_at > (NOW() - INTERVAL '" + (days * 24) + " hour'" + ")"))
                  .fetchAll()
                  .then((appSumPromises) => {
                    return appSumPromises;
                  })
                  .catch((error) => {
                    console.error("Error in finding server summaries", error);
                  });
        });
        //Promise all to properly wait for array of promises to resolve
        return Promise.all(promises).then((appSummariesPromise) => {
          return appSummariesPromise;
      })
      .then((appSummaries) => {
        var serverApps = {};
        _.each(appSummaries, (appArr) => {
          _.each(appArr.models, (app) => {
            var appModel = app.attributes;
            //If route does not belonge to this server, skip it
            if (!serverRoutes[appModel.route]) { return; }
            //Sort by app and date
            var dateId = appModel.year +
              (appModel.month.length > 1 ? appModel.month : '0' + appModel.month) +
              (appModel.day.length > 1 ?  appModel.day : '0' + appModel.day);
            var appId = appModel.appid;
            if (!serverApps[appId]) {
              serverApps[appId] = {};
              serverApps[appId][dateId] = [appModel];
            } else if (serverApps[appId] && !serverApps[appId][dateId]) {
              serverApps[appId][dateId] = [appModel];
            } else {
              serverApps[appId][dateId].push(appModel);
            }
          });
        });
        //Compile total hits for each day and format for graphs
        var serverAppSums = [];
        _.each(serverApps, (serverApp) => {
          var appDateSum = [];
          _.each(serverApp, (appDateArr) => {
            var totalHits = _.reduce(appDateArr, (memo, appDate) => {
              return memo + +appDate.value;
            }, 0);
            var date = appDateArr[0].year +
              (appDateArr[0].month.length > 1 ? appDateArr[0].month : '0' + appDateArr[0].month) +
              (appDateArr[0].day.length > 1 ? appDateArr[0].day : '0' + appDateArr[0].day);
            appDateSum.push({appid: appDateArr[0].appid, date: date, timestamp: appDateArr[0].created_at, value: totalHits});
          });
          serverAppSums.push({app: appDateSum[0].appid, data: appDateSum});
        });
        //Add app summaries to response object before sending
        serverCompleteSummary.Apps = serverAppSums;
        res.send(serverCompleteSummary);
      });
    });
  })
  .catch(function(error) {
    console.log('Error getting app summary', error);
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
      var dateId =  appRoute.year +
        (appRoute.month.length > 1 ? appRoute.month : '0' + appRoute.month) +
        (appRoute.day.length > 1 ? appRoute.day : '0' + appRoute.day);
      //Initialize Totals for each date
      if (!appTotalHits[dateId]) {
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
        var date = routeDateArr[0].year +
          (routeDateArr[0].month.length > 1 ? routeDateArr[0].month : '0' + routeDateArr[0].month) +
          (routeDateArr[0].day.length > 1 ? routeDateArr[0].day : '0' + routeDateArr[0].day);
        appTotalHits[date] += totalHits;
        routeDateSum.push({route: routeDateArr[0].route, date: date, timestamp: routeDateArr[0].created_at, value: totalHits});
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
            var dateId = serverModel.year +
              (serverModel.month.length > 1 ? serverModel.month : '0' + serverModel.month) +
              (serverModel.day.length > 1 ?  serverModel.day : '0' + serverModel.day);
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
            var date = serverDateArr[0].year +
              (serverDateArr[0].month.length > 1 ? serverDateArr[0].month : '0' + serverDateArr[0].month) +
              (serverDateArr[0].day.length > 1 ? serverDateArr[0].day : '0' + serverDateArr[0].day);
            serverDateSum.push({serverid: serverDateArr[0].serverid, date: date, timestamp: serverDateArr[0].created_at, value: totalHits});
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

