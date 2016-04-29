var clientApps = require('../db/collections/client-apps');
var clientServers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var hashes = require('../db/collections/hashes');
var lookup = require('./lookup');
var statsController = {};

/* store the stats into postgresql */
var storeStats = function (statistics, foreignID) {
  /* consolidate stats for endpoints disregarding the trailing slash */
  for (var stat in statistics) {
    if (stat === '/' || stat[stat.length - 1] !== '/') {
      continue;
    }

    var trueEndPoint = stat.replace(/\/$/, '');
    statistics[trueEndPoint] = (statistics[trueEndPoint] || 0) + statistics[stat];
    delete (statistics[stat]);
  }
  
  for (var stat in statistics) {
    new stats.model({
      statName: stat,
      statValue: statistics[stat],
      /* use attach for the foreign keys later? */
      clientServers_id: foreignID[0],
      clientApps_id: foreignID[1]
    }).save();
  }
};

/* handler for post request of stats from client */
statsController.processStats = function (req, res) {
  var hash = req.body.hash;
  var token = req.body.token;
  var statistics = req.body.statistics;
  var foreignID = lookup.hash2ID(hash);

  if (!hash) {
    /* no hash sent this is a critical error */
    console.log('Error: No Hash in Request', error);
    res.status(500).send('Error: No Hash in Request');
    return;
  }
  
  if (!foreignID) {
    /* Foreign IDs not found in hash table look them up */
    hashes.model.where('hash', hash).fetch()
      .then(function (hash) {
        if (!hash) {
          /* hash is missing from db so force client to re-register */
          res.status(409).send('Error: Hash not found.  Re-register the client');
          return;
        } else {
          lookup.storeHash2ID(hash.hash, hash.clientServers_id, hash.clientApps_id);
          foreignID = [hash.clientServers_id, hash.clientApps_id];
        }
        storeStats(statistics, foreignID);
        res.status(200).end('');
      })
      .catch(function (error) {
        console.log('Error: Hash Processing Failed', error);
        res.status(500).send('Error: Internal Server Error');
      });
  } else {
    /* we have the Foreign IDs so just store the stats */
    storeStats(statistics, foreignID);
    res.status(200).end('');
  }
};

statsController.registerClient = function (req, res) {
  var ip = req.body.ip;
  var hostname = req.body.hostname;
  var appname = req.body.appname;
  var computedHash = null;

  // must be a better way than this
  var serverID = null;
  var appID = null;

  /* put server ip and appname in db if it does't already exist */
  clientServers.model.where('ip', ip).fetch().then(function (clientServer) {
    if (!clientServer) {
      return new clientServers.model({ ip: ip }).save();
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
        return new clientApps.model({ appname: appname }).save();
      } else {
        return clientApp;
      }
    })
    .then(function (clientApp) {
      /* compute the hash for quicker ID lookups when storing stats     *
       * and send it to the client so they can use it in their post req */
      appID = clientApp.id;
      
      computedHash = lookup.storeName2Hash(ip, appname);
      lookup.storeHash2ID(computedHash, serverID, appID);
      
      return hashes.model.where('hash', computedHash).fetch();
    })
    .then(function (hash) {
      /* keep a backup copy of the hash in hash db if controller gets reloaded */
      if (!hash) {
        return new hashes.model({
          clientApps_id: appID,
          clientServers_id: serverID,
          hash: computedHash,
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
    })
    .catch(function (error) {
      console.log('Stats Client Registration Failure', error);
      res.status(500).send('Stats Client Registration Failure');
    });
}

module.exports = statsController;
