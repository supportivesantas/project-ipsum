var AppSums = require('../db/collections/appsummaries.js');
var ServerSums = require('../db/collections/serversummaries.js');
var Hash = require('../db/collections/hashes.js');
var _ = require('underscore');
var Promise = require('bluebird');
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


// exports.myAppSummary = function(req, res) {
//   //add numDays later (raw search)
//   ServerSums.model.where({'users_id': 1, 'serverid': 2})
//   .fetchAll()
//   .then((serverSummaries) => {
//     console.log(serverSummaries);
//     res.send(serverSummaries);
//   })
//   .catch((error) => {
//     console.error('Error getting servers for app', error);
//     res.send(error);
//   });
// };

exports.myAppSummary = (req, res) => {
  //Filter By User ID and APP ID and have req.body for time interval (1-30 days)
  var userId = 1;
  var appId = 1;
  var days = 1;
  //add days later (raw search)
  Hash.model.where({'users_id': userId, 'clientApps_id': appId }).fetchAll().then((appServers) => {
    // res.send(appServers);
    var appServerModels = appServers.models;
    var getAppServersIds = [];
    //Put getServersForApp function in array with each correct server Id so we can promise.all
    _.each(appServerModels, (appServer) => {
      getAppServersIds.push(appServer.attributes.clientServers_id);
    });

    var promises = _.map(getAppServersIds, (serverId) => {
      return ServerSums.model.where({'users_id': userId, 'serverid': serverId }) ///INCLUDE HOURS HERE LATER
              .fetchAll()
              .then((serverSumPromises) => {
                return serverSumPromises;
              })
              .catch((error) => {
                console.error("Error in finding server summaries", error);
              });
    });
    return Promise.all(promises).then((serverSummariesPromise) => {
      return serverSummariesPromise;
    })
    .then((serverSummaries) => {

      res.send(serverSummaries);
    });
  })

  // AppSums.model.where({'users_id': userId, 'id': appId })
  // .fetchAll()
  // .then(function(serverSummary) {
  //   // console.log(serverSummary);
  //   res.send(serverSummary.models);
  // })
  .catch(function(error) {
    console.log('Error getting app summary', error);
    res.send(500);
  });
};

//   {
//     Total: [{data:[{ dayago: 1, day: 'date', totalHits: ''}]
//     Routes: [{route: "aroute", data:[{dayago: 1, day: 'date', totalHits: ''}]}],
//     Servers: [{server: 'aserverid', data:[{dayago: 1, day: 'date', totalHits: ''}]}]
//   }
// data looks the same in each [{dayago: 1, day: 'date', totalHits: ''}, {dayago: 1, day: 'date', totalHits: ''}]
