"use strict";

const configure = ('../server/api/configure');
const pgp = require('pg-promise')({});
const app = require('./app');
const server = require('./server');
const stats = require('./stats');

var maxAppsPerServer = 3; // max 3 apps per server
var maxRoutes = 50; // max 50 routes
var maxDepth = 5;   // max path depth is 5
var generateMaxDays = 7;

var appNames = [
  'picpost',
  'directmsg',
  'comments',
  'usrmgmt',
  'likes',
  'follower',
];

var serverNames = [
  'SFO1', 'SFO2', 'SFO3', 'SFO4',
  'NYC1', 'NYC2', 'NYC3', 'NYC4',
  'HKG1', 'HKG2', 'HKG3', 'HKG4',
  'CPH1', 'CPH2', 'CPH3', 'CPH4',
  'EZE1', 'EZE2', 'EZE3', 'EZE4',
  'CPT1', 'CPT2', 'CPT3', 'CPT4',
];

var randomRoute = [
  'auth',
  'post',
  'check',
  'rane',
  'matt',
  'jon',
  'roland',
  'banana',
  'apple',
  'orange',
  'strawberry',
  'stop',
  'go',
  'monopoly',
  'give',
  'me',
  'money'
];

var servers = [];
var apps = [];

var compileStats = () => { 
  var currentServer = 0;
  var currentDate = new Date();

  console.log('Generating stats and saving to database');

  // loop for each server
  var loopServer = () => {
    var wdate = new Date();
    var timeStamps = [];

    // loop through each timestamp
    var currentStamp = 0;
    var completed = true;

    // start 1 days before
    wdate.setDate(currentDate.getDate() - generateMaxDays);

    // generate timestamps between then and now
    while (wdate.getTime() < currentDate.getTime()) {
      timeStamps.push(new Date(wdate));

      var variance = Math.floor(Math.random() * 5000); // variance is 5 seconds?
      wdate.setTime(wdate.getTime() + 3600000 + variance); // add one hour + some minor variation
    }

    // randomly choose number of servers up to maxAppsPerServer
    var numApps = Math.ceil(Math.random() * maxAppsPerServer);
    var theseApps = [];
    for (let i = 0; i < numApps; i++) {
      var currentApp = Math.floor(Math.random() * apps.length);
      theseApps.push(currentApp);
    }

    var loopTime = () => {
      // if not completed previous insertions wait another 10 ms
      if (!completed) {
        setTimeout(loopTime, 10);
        return;
      } else if (currentStamp < timeStamps.length) {
        // ok we are done so go do the next one
        completed = false;
      } else {
        // we completed all the timestamps for this server go to next server
        console.log('Done for server ' + servers[currentServer].hostname);
        console.log((currentServer + 1) + ' out of ' + servers.length);
        currentServer++;
        if (currentServer < servers.length) {
          loopServer();
        } else {
          console.log('COMPLETELY DONE');
          process.exit(0);
        }
        return;
      }

      // for each app generate some stats on this server
      for (var i = 0; i < numApps; i++) {
        var testStat = new stats(servers[currentServer], apps[theseApps[i]], 1000, timeStamps[currentStamp]);

        // save hash        
        testStat.saveHash(client);

        // build the stats
        testStat.buildStats();

        // save the stats and when it's all saved set completed to true
        testStat.save(client, () => {
          completed = true;
          delete this;
        });
      }

      // we're done with this timestamp just need to wait for insertions to complete
      // increase the timestamp count so we're ready to use the next one
      currentStamp++;

      // wait for the insertions to finish
      setTimeout(loopTime, 10);
    }

    // start trying inserting for this server
    loopTime();
  }

  // try all servers
  loopServer();
}

var initAppsServers = () => {
  
  /* save apps and servers */
  for (var serverName of serverNames) {
    var thisServer = new server(serverName);
    thisServer.randomizeIP();
    thisServer.save(client);
    servers.push(thisServer);
  }

  for (var appName of appNames) {
    var thisApp = new app(appName);
    var maxRoutesApp = Math.ceil(Math.random() * maxRoutes); // max 50 routes
    var maxDepthApp = Math.ceil(Math.random() * maxDepth); // max 5 depth
    thisApp.buildRoutes(maxRoutesApp, maxDepthApp, randomRoute);
    thisApp.save(client);
    apps.push(thisApp);
  }

  // wait a generous 1 second for the inserts to finish
  setTimeout(compileStats, 1000);
}  

var client = pgp({
  connectionString: process.env.PG_CONNECTION_STRING
});

client.connect()
  .then((result) => {
    /* */
    console.log('Initializing Servers and Apps');
    initAppsServers();
  })
  .catch((error) => {
    console.log('ERROR: Failed to connect to Postgres!', error)
  });

