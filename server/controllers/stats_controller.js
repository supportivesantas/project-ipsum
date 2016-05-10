"use strict";
var users = require('../db/collections/users');
var clientApps = require('../db/collections/client-apps');
var clientServers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var hashes = require('../db/collections/hashes');
var lookup = require('./lookup');
var internalTasks = require('./internal_tasks');
var nginxController = require('./nginxController');
var Promise = require('bluebird');
var statsController = {};

/* store the stats into postgresql */
var storeStats = (statistics, foreignID) => {
  /* consolidate stats for endpoints disregarding the trailing slash */
  for (let stat in statistics) {
    if (stat === '/' || stat[stat.length - 1] !== '/') {
      continue;
    }

    let trueEndPoint = stat.replace(/\/$/, '');
    statistics[trueEndPoint] = (statistics[trueEndPoint] || 0) + statistics[stat];
    delete (statistics[stat]);
  }

  let statsArray = [];
  for (let stat in statistics) {
    statsArray.push(new stats.model({
      statName: stat,
      statValue: statistics[stat],
      /* use attach for the foreign keys later? */
      users_id: foreignID[0],
      clientServers_id: foreignID[1],
      clientApps_id: foreignID[2]
    }).save());
  }

  return Promise.all(statsArray);
};

/* handler for post request of stats from client */
statsController.processStats = (req, res) => {
  let hash = req.body.hash;
  let username = req.body.username;
  let statistics = req.body.statistics;
  let foreignID = lookup.hash2ID(hash);

  if (!hash) {
    /* no hash sent this is a critical error */
    console.log('Error: No Hash in Request');
    res.status(500).send('Error: No Hash in Request');
    return;
  }
  
  if (!foreignID) {
    /* Foreign IDs not found in hash table look them up */
    hashes.model.where('hash', hash).fetch()
      .then((hash) => {
        if (!hash) {
          /* hash is missing from db so force client to re-register */
          res.status(409).send('Error: Hash not found.  Re-register the client');
          return;
        } else {
          lookup.storeHash2ID(hash.hash, hash.users_id, hash.clientServers_id, hash.clientApps_id);
          foreignID = [hash.hash, hash.clientServers_id, hash.clientApps_id];
        }
        return storeStats(statistics, foreignID);
      })
      .then((result) => {
        res.status(200).end('');
      })
      .catch((error) => {
        console.log('Error: Hash Processing Failed', error);
        res.status(500).send('Error: Internal Server Error');
      });
  } else {
    /* we have the Foreign IDs so just store the stats */
    storeStats(statistics, foreignID)
      .then((result) => {
        res.status(200).end('');
      })
      .catch((error) => {
        console.log('Error: Hash Processing Failed', error);
        res.status(500).send('Error: Internal Server Error');
      });
  }
};

statsController.registerClient = function (req, res) {
  var username = req.body.username;
  var ip = req.body.ip;
  var hostname = req.body.hostname;
  var appname = req.body.appname;
  var port = req.body.port;
  var computedHash = null;
  console.log('username is ' + username);
  // must be a better way than this
  var serverID = null;
  var appID = null;
  var userID = null;

  // nginxController.list('192.241.204.49:80', 'project')
  //   .then((result) => {
  //     console.log(result);
  //   });
  users.model.where('username', username).fetch()
    .then(function (user) {
      if (!user) {
        return new users.model({ username: username }).save();
      } else {
        return user;
      }
    })
    .then(function (user) {
      userID = user.get('id');
      /* put server ip and appname in db if it does't already exist */
      return clientServers.model.where('ip', ip).fetch();
    })
    .then(function (clientServer) {
      if (!clientServer) {
        return new clientServers.model({
          users_id: userID,
          ip: ip,
          hostname: hostname
        }).save();
      } else {
        return clientServer;
      }
    })
    .then(function (clientServer) {
      serverID = clientServer.id;
      return clientApps.model.where('appname', appname).fetch();
    })
    .then(function (clientApp) {
      if (!clientApp) {
        return new clientApps.model({ users_id: userID, appname: appname, port: port }).save();
      } else {
        return clientApp;
      }
    })
    .then(function (clientApp) {
      /* compute the hash for quicker ID lookups when storing stats     *
       * and send it to the client so they can use it in their post req */
      appID = clientApp.id;

      computedHash = lookup.storeName2Hash(username, ip, appname);
      lookup.storeHash2ID(computedHash, userID, serverID, appID);
      console.log('computedHash is ' + computedHash);
      return hashes.model.where('hash', computedHash).fetch();
    })
    .then(function (hash) {
      /* keep a backup copy of the hash in hash db if controller gets reloaded */
      if (!hash) {
        return new hashes.model({
          users_id: userID,
          clientApps_id: appID,
          clientServers_id: serverID,
          hash: computedHash,
          username: username,
          ip: ip,
          appname: appname
        }).save();
      } else {
        return hash;
      }
    })
    .then(function (hash) {
      console.log('Stats Client Successfully Registered for IP: ' + ip);
      res.status(200).send(computedHash);
      internalTasks.syncServersToPlatforms(userID);
      internalTasks.syncServersToLB(userID);
    })
    .catch(function (error) {
      console.log('Stats Client Registration Failure', error);
      res.status(500).send('Stats Client Registration Failure');
    });
};

module.exports = statsController;
