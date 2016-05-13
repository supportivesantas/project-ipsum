var AppSums = require('../db/collections/appsummaries.js');
var ServerSums = require('../db/collections/serversummaries.js');
var Hash = require('../db/collections/hashes.js');
var _ = require('underscore');
var Promise = require('bluebird');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

Date.prototype.subDays = function(days) {
   var dat = new Date(this.valueOf());
   dat.setDate(dat.getDate() - days);
   return dat;
};

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate >= stopDate) {
    var day = currentDate.getDate().toString();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear().toString();
    var date = year +
      (month.toString().length > 1 ? month : "0" + month) +
      (day.toString().length > 1 ? day : "0" + day);
    dateArray.push(+date);
    currentDate = currentDate.subDays(1);
  }
  return dateArray;
}

exports.allAppSummaries = function(req, res) {
  userId = req.user.id;
  //To fill in any missing data points week summary (last seven dates)
  var dateArray = getDates(new Date().subDays(1), (new Date()).subDays(7));

  AppSums.model.where({'users_id': userId})
  .where(knex.raw("created_at > (NOW() - INTERVAL '" + (8 * 24) + " hour'" + ")"))
  .fetchAll()
  .then((allUserApps) => {
    var allAppsByRoute = allUserApps.models;
    var appsObj = {};
    var today = new Date();
    //Organize by app
    _.each(allAppsByRoute, (appAndRoute) => {
      var app = appAndRoute.attributes;
      var appDay = app.day.length > 1 ? app.day : '0' + app.day;
      var appMonth = app.month.length > 1 ? app.month : '0' + app.month;
      var date = app.year + appMonth + appDay;
      app.dateId = date;
      //don't include today, just previous seven days
      if (+app.day === today.getDate()) { return; }
      if (!appsObj[app.appid]) {
        appsObj[app.appid] = {
          appid: app.appid,
          routes: {},
          dates: {}
        };
        appsObj[app.appid].dates[date] = [app];
      } else if (!appsObj[app.appid].dates[date]) {
        appsObj[app.appid].dates[date] = [app];
      } else {
        appsObj[app.appid].dates[date].push(app);
      }
      appsObj[app.appid].routes[app.route] = app.route;
    });
    //Compile total hits for each day
    var formattedAppsArr = [];
    _.each(appsObj, (appObj) => {
      formattedAppsArr.push({appid: appObj.appid, totalRoute: Object.keys(appObj.routes).length, data: []});
      _.each(appObj.dates, (date) => {
        var hitsPerDate = _.reduce(date, (memo, curr) => {
          return memo + +curr.value;
        }, 0);
        formattedAppsArr[formattedAppsArr.length - 1].data.push({date: +date[0].dateId, value: hitsPerDate});
      });
    });
    //Add in data point value:0 if no hits for a day
    _.each(formattedAppsArr, (formattedApp) => {
      var appId = formattedApp.appid;
      var datesCheck = dateArray.slice();
      //See what dates exist and take out of dates check
      _.each(formattedApp.data, (dateObj) => {
        var datesCheckIndex = datesCheck.indexOf(dateObj.date);
        if (datesCheckIndex !== -1) {
          datesCheck.splice(datesCheckIndex, 1);
        }
      });
      //Add value: 0 for all dates left over in DatesCheck
      _.each(datesCheck, (date) => {
        formattedApp.data.push({date: date, value: 0});
      });
    });
    res.send(formattedAppsArr);
  })
  .catch(function(error) {
    console.log('Error getting all App Summaries', error);
    res.send(500);
  });
};


exports.myServerSummary = (req, res) => {
  if (typeof req.body.days !== "number") {
    res.status(400).end("Invalid input");
    return;
  }
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
        routeDateSum.push({route: routeDateArr[0].route, date: +date, value: totalHits});
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
            appDateSum.push({appid: appDateArr[0].appid, date: +date, value: totalHits});
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
  if (typeof req.body.days !== "number") {
    res.status(400).end("Invalid input");
    return;
  }
  var userId = req.user.id ;
  var appId = req.body.appId;
  var days = req.body.days;

  var dateArray = getDates(new Date().subDays(1), (new Date()).subDays(days));
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
        routeDateSum.push({route: routeDateArr[0].route, date: +date, value: totalHits});
      });
      appRouteSums.push({route: routeDateSum[0].route, data: routeDateSum});
    });
    appTotalHitsFormatted = [];
    for (var date in appTotalHits) {
      appTotalHitsFormatted.push({date: +date, value: appTotalHits[date]});
    }
    //Create response object with data available so far
    var appCompleteSummary = {
      Total : appTotalHitsFormatted,
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
            serverDateSum.push({serverid: serverDateArr[0].serverid, date: +date, value: totalHits});
          });
          appServerSums.push({server: serverDateSum[0].serverid, data: serverDateSum});
        });
        //Add server summaries to response object before sending
        appCompleteSummary.Servers = appServerSums;


        //Add in data point value:0 if no hits for a day
        _.each(appCompleteSummary.Routes, (route) => {
          var datesCheck = dateArray.slice();
          //See what dates exist and take out of dates check
          _.each(route.data, (dateObj) => {
            var datesCheckIndex = datesCheck.indexOf(dateObj.date);
            if (datesCheckIndex !== -1) {
              datesCheck.splice(datesCheckIndex, 1);
            }
          });
          //Add value: 0 for all dates left over in DatesCheck
          _.each(datesCheck, (date) => {
            route.data.push({route: route.route, date: date, value: 0});
          });
        });

                //Add in data point value:0 if no hits for a day
        _.each(appCompleteSummary.Servers, (server) => {
          var datesCheck = dateArray.slice();
          //See what dates exist and take out of dates check
          _.each(server.data, (dateObj) => {
            var datesCheckIndex = datesCheck.indexOf(dateObj.date);
            if (datesCheckIndex !== -1) {
              datesCheck.splice(datesCheckIndex, 1);
            }
          });
          //Add value: 0 for all dates left over in DatesCheck
          _.each(datesCheck, (date) => {
            server.data.push({serverid: server.server, date: date, value: 0});
          });
        });

        var datesCheck = dateArray.slice();
        //See what dates exist and take out of dates check
        _.each(appCompleteSummary.Total, (dateObj) => {
          var datesCheckIndex = datesCheck.indexOf(dateObj.date);
          if (datesCheckIndex !== -1) {
            datesCheck.splice(datesCheckIndex, 1);
          }
        });
        //Add value: 0 for all dates left over in DatesCheck
        _.each(datesCheck, (date) => {
          appCompleteSummary.Total.push({date: date, value: 0});
        });


        res.send(appCompleteSummary);
      });
    });
  })
  .catch(function(error) {
    console.log('Error getting app summary', error);
    res.send(500);
  });
};

