"use strict";

const configure = ('../server/api/configure');
const pgp = require('pg-promise')({
  promiseLib: Promise,
});
const app = require('./app');
const server = require('./server');
const stats = require('./stats');

var maxAppsPerServer = 1; // max 1 apps per server
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

var userID = null;
var username = null;
var servers = [];
var apps = [];

var compileStats = () => {
  var currentServer = 0;
  var currentDate = new Date();

  console.log('Generating stats and saving to database');

  // loop for each server
  let loopServer = () => {
    let wdate = new Date(); // working date
    let timeStamps = []; // array containing all timestamps for this server

    // keep track of current working timestamp
    let currentStamp = 0;

    // start generateMaxDays days before
    wdate.setDate(currentDate.getDate() - generateMaxDays);

    // generate timestamps between then and now
    while (wdate.getTime() < currentDate.getTime()) {
      timeStamps.push(new Date(wdate));

      let variance = Math.floor(Math.random() * 5000); // variance is 5 seconds?
      wdate.setTime(wdate.getTime() + 3600000 + variance); // add one hour + some minor variation
    }

    // randomly choose number of apps up to maxAppsPerServer for this server to host
    let numApps = Math.ceil(Math.random() * maxAppsPerServer);
    let theseApps = [];
    let appIdx = 0;
    for (let i = 0; i < numApps; i++) {
      let currentApp = Math.floor(Math.random() * apps.length);
      theseApps.push(currentApp);
    }

    // work on each timestamp recursively    
    let loopTime = () => {
      if (currentStamp >= timeStamps.length) {
        /* we completed all the timestamps for this server go to next server */
        console.log('Done for server ' + servers[currentServer].hostname);
        console.log((currentServer + 1) + ' out of ' + servers.length);
        currentServer++;
        if (currentServer < servers.length) {
          loopServer();
        } else {
          /* finished all servers now bail */
          console.log('COMPLETELY DONE');
          process.exit(0);
        }
        return;
      }

      // for each app generate some stats on this server
      var testStat = new stats(userID, username, servers[currentServer], apps[theseApps[appIdx]], 1000, timeStamps[currentStamp]);

      // save hash        
      testStat.saveHash(client);

      // build the stats
      testStat.buildStats();

      // save the stats and when it's all saved call recursively to start next app for this timestamp
      testStat.save(client)
        .then((result) => {
          if (++appIdx >= numApps) {
            /* we finished all apps for this current time stamp go to next timestamp */
            appIdx = 0;
            currentStamp++;
          }

          loopTime();
        })
        .catch((error) => {
          console.log('failed to save testStat');
          console.log(error);
        });
    };

    // start trying inserting for this server
    loopTime();
  };

  // try all servers
  loopServer();
};

var initAppsServers = () => {
  
  /* save apps and servers */
  for (var serverName of serverNames) {
    var thisServer = new server(userID, serverName);
    thisServer.randomizeIP();
    thisServer.save(client);
    servers.push(thisServer);
  }

  for (var appName of appNames) {
    var thisApp = new app(userID, appName);
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

if (process.argv.length < 3) {
  console.log('Usage node ./seed_data/index.js github_user_name');
  process.exit();
}

client.connect()
  .then((result) => {
    username = process.argv[2];
    console.log('Initializing Servers and Apps');
    client.query('INSERT INTO "users" ("username") VALUES (${username}) ON CONFLICT ("username") DO UPDATE SET username = ${username} RETURNING id',
    {username: username})
      .then((result) => {
        console.log('Inserted user ' + username + ' ', result);
        userID = result[0].id;
        initAppsServers();
      })
      .catch((error) => {
        console.log('ERROR: Failed to insert user.', error);
        process.exit();
      });
    
  })
  .catch((error) => {
    console.log('ERROR: Failed to connect to Postgres!', error)
  });

