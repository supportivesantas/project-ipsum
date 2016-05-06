var clientApps = require('../db/collections/client-apps');
var Server = require('../db/models/client-server');
var Servers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var ctrl = require('./getStats_controller.js');
var _ = require('underscore');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});


exports.getAllServerIds = (callback) => {
  console.log('getting server ids');
  const serverIds = [];
  Servers.fetch()
    .then((servers) => {
      _.each(servers.models, (item) => {
        serverIds.push(item.attributes.id);
      });
      callback(serverIds);
    });
};

exports.getAllAppIds = (callback) => {
  console.log('getting app ids');
  const appIds = [];
  clientApps.fetch()
    .then((apps) => {
      _.each(apps.models, (item) => {
        appIds.push(item.attributes.id);
      });
      callback(appIds);
    });
};


exports.singleApp = function(appId, callback) {
  var hoursvar = 24; //default to last twelve hours
  var dataRange = _.range(hoursvar + 1);

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
          callback(ctrl.formatDataByHour(allRoutes, serverStats, dataRange));
        })
        .catch(function(error) {
          console.error("Get stats error", error);
        });
    });
};

exports.singleServerSummary = function(serverId, callback) {
  console.log('geting a single server summary for ', serverId);
  var hoursvar = 24; //default to last twelve hours
  var dataRange = _.range(hoursvar + 1);

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
          callback(ctrl.formatDataByHour(allRoutes, serverStats, dataRange));
          
        })
        .catch(function(error) {
          console.error("Get stats error", error);
        });
    });
};
