var allAppSums = require('../db/collections/appsummaries.js');
var myServerSums = require('../db/collections/serversummaries.js');
var _ = require('underscore');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});


//===================================================
//  TODO: Will want to sort by userId, so must include in table
//  ALSO search for last seven days -- maybe use date.now minus created_at and convert to days
//  ALSO want to add server Ids in here (and server status??) so can total up and relate server to app
//====================================================

exports.allAppSummaries = function(req, res) {
  allAppSums.model.fetchAll()
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

exports.myServerSummary = function(req, res) {
//WILL BE FOR INDIVIDUAL SERVERS ON MY SERVER PAGE
  myServerSums.model.fetchAll()
  .then(function(serverSummary) {
    console.log(serverSummary);
    res.send(serverSummary.models);
  })
  .catch(function(error) {
    console.log('Error getting all Server Summaries', error);
    res.send(500);
  });
};



//   {
//     appid: 1,
//     routes: [{ routename: "Ex", hits: 20}],
//     date: "dateobj"
//   }
