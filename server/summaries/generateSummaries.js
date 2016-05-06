var clientApps = require('../db/collections/client-apps');
var Server = require('../db/models/client-server');
var Servers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var _ = require('underscore');
const pgp = require('pg-promise')({});
// var knex = require('knex')({
//   client: 'pg',
//   connection: process.env.PG_CONNECTION_STRING,
// });
// var db = require('bookshelf')(knex);
var client = pgp({
  connectionString: process.env.PG_CONNECTION_STRING,
});


const formatDataByHour = function(allRoutes, serverStats, dataRange) {
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

const getAllServerIds = (callback) => {
  console.log('getting server ids');
  const serverIds = [];
  client.query('select "id" from "clientServers"')
    .then((servers) => {
      _.each(servers, (item) => {
        serverIds.push(item.id);
      });
      callback(serverIds);
    });
};

const singleServerSummary = function(serverId, callback) {
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
          return formatDataByHour(allRoutes, serverStats, dataRange);
          
        })
        .catch(function(error) {
          console.error("Get stats error", error);
        });
    });
};

const generateServerSummaries = () => {
  let count = 0;
  getAllServerIds((serverList) => {
    const summaries = [];
    for (let i = 0; i < serverList.length; i++) {
      singleServerSummary(serverList[i], (data) => {

        for (let j = 0; j < data.length; j++) {
          if (data[j].route !== 'Total') {
            const hits = _.reduce(data[j].data, (memo, dataPoint) => {
              return memo + dataPoint.hits;
            }, 0);
            console.log(hits);
            count++;
            console.log('Server Summary #' + count + ' generated');
            summaries.push({
              serverid: serverList[i],
              route: data[j].route,
              value: hits,
              day: new Date(),
            });
          }
        }
      });
    }
    console.log(summaries.length);
    // knex.insert(summaries, 'id').into('serversummaries');
  });
};

client.connect()
  .then((result) => {
    /* */
    console.log('Generating Server Summary Data');
    //function
    generateServerSummaries();

  })
  .catch((error) => {
    console.log('ERROR: Failed to connect to Postgres!', error)
  });



