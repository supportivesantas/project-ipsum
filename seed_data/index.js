"use strict";

const configure = ('../server/api/configure');
const Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise,
});
const app = require('./app');
const server = require('./server');
const stats = require('./stats');

var maxAppsPerServer = 1; // max 1 apps per server
var maxRoutes = 50; // max 50 routes
var maxDepth = 5;   // max path depth is 5
var generateMaxDays = 31;
var currentDate = new Date();

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

var storedProcedureApp = 'CREATE OR REPLACE FUNCTION public.aggregate_app(clientapps_id integer, month integer, day integer, year integer) RETURNS void AS $BODY$DECLARE tablename TEXT; route RECORD; workdate DATE; nextworkdate DATE; userid INTEGER; routehits INTEGER; BEGIN workdate = (year::text || \'-\' || month::text || \'-\' || day::text)::date; nextworkdate = workdate + 1; userid = (SELECT "users_id" FROM "stats" WHERE "clientApps_id" = clientapps_id LIMIT 1); tablename = (userid::text || clientapps_id::text || month::text || day::text || year::text); EXECUTE FORMAT(\'DROP TABLE IF EXISTS %I\', tablename); EXECUTE FORMAT(\'CREATE TEMP TABLE %I ON COMMIT DROP AS (SELECT DISTINCT "statName" FROM "stats" WHERE "clientApps_id" = %L)\', tablename, clientapps_id::integer); FOR route IN EXECUTE FORMAT(\'SELECT "statName" FROM %I\', tablename) LOOP routehits = (SELECT SUM("statValue") FROM "stats" WHERE "statName" = route."statName" AND created_at >= workdate AND created_at < nextworkdate); INSERT INTO "appsummaries" ("users_id", "appid", "route", "value", "day", "month", "year", "created_at") VALUES (userid, clientapps_id, route."statName", routehits, day, month, year, nextworkdate); END LOOP; END $BODY$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF COST 100;';

var storedProcedureServer = 'CREATE OR REPLACE FUNCTION public.aggregate_server(clientservers_id integer, month integer, day integer, year integer) RETURNS void AS $BODY$DECLARE tablename TEXT; route RECORD; workdate DATE; nextworkdate DATE; userid INTEGER; routehits INTEGER; BEGIN workdate = (year::text || \'-\' || month::text || \'-\' || day::text)::date; nextworkdate = workdate + 1; userid = (SELECT "users_id" FROM "stats" WHERE "clientServers_id" = clientservers_id LIMIT 1); tablename = (userid::text || clientservers_id::text || month::text || day::text || year::text); EXECUTE FORMAT(\'DROP TABLE IF EXISTS %I\', tablename); EXECUTE FORMAT(\'CREATE TEMP TABLE %I ON COMMIT DROP AS (SELECT DISTINCT "statName" FROM "stats" WHERE "clientServers_id" = %L)\', tablename, clientservers_id::integer); FOR route IN EXECUTE FORMAT(\'SELECT "statName" FROM %I\', tablename) LOOP routehits = (SELECT SUM("statValue") FROM "stats" WHERE "statName" = route."statName" AND created_at >= workdate AND created_at < nextworkdate); INSERT INTO "serversummaries" ("users_id", "serverid", "route", "value", "day", "month", "year", "created_at") VALUES (userid, clientservers_id, route."statName", routehits, day, month, year, nextworkdate); END LOOP; END $BODY$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF COST 100;';

var userID = null;
var username = null;
var servers = [];
var apps = [];

var compileStats = () => {
  var currentServer = 0;

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
          generateSummaries();
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

// generate summaries
let generateSummaries = () => {
  let appQueries = [];
  let serverQueries = [];
  let finished = 0;
  let appDatesCrunched = 0;
  let serverDatesCrunched = 0;
  let appwdate = new Date(currentDate); // working date
  let serverwdate = new Date(currentDate); // working date


  let appProcessing = () => {
    console.log('Processing App ' + appDatesCrunched);
    // generate for apps first
    for (let myapp of apps) {
      console.log(myapp.id + ' ' + (appwdate.getMonth() + 1) + ' ' + appwdate.getDate() + ' ' + appwdate.getFullYear());
      appQueries.push(client.func('aggregate_app', [myapp.id, appwdate.getMonth() + 1, appwdate.getDate(), appwdate.getFullYear()]));
    }
    Promise.all(appQueries)
      .then((result) => {
        appwdate.setDate(appwdate.getDate() - 1);
        if (++appDatesCrunched >= generateMaxDays) {
          finished++;
          if (finished === 2) {
            console.log('COMPLETELY DONE');
            process.exit(0);
          }
        } else {
          console.log('App Done');
          appProcessing();
        }
      })
      .catch((error) => {
        console.log('ERROR: Failed to generate summaries', error);
        process.exit(0);
      });
  };

  let serverProcessing = () => {
    console.log('Processing Server ' + serverDatesCrunched);
    // generate for apps first
    for (let myserver of servers) {
      console.log(myserver.id + ' ' + (serverwdate.getMonth() + 1) + ' ' + serverwdate.getDate() + ' ' + serverwdate.getFullYear());
      serverQueries.push(client.func('aggregate_server', [myserver.id, serverwdate.getMonth() + 1, serverwdate.getDate(), serverwdate.getFullYear()]));
    }
    Promise.all(serverQueries)
      .then((result) => {
        serverwdate.setDate(serverwdate.getDate() - 1);
        if (++serverDatesCrunched >= generateMaxDays) {
          finished++;
          if (finished === 2) {
            console.log('COMPLETELY DONE');
            process.exit(0);
          }
        } else {
          console.log('Server Done');
          serverProcessing();
        }
      })
      .catch((error) => {
        console.log('ERROR: Failed to generate summaries', error);
        process.exit(0);
      });
  };

  appProcessing();
  serverProcessing();
  
};











var client = pgp(process.env.PG_CONNECTION_STRING);

if (process.argv.length < 3) {
  console.log('Usage node ./seed_data/index.js github_user_name');
  process.exit();
}

client.connect()
  .then((result) => {
    // install procedure to compile app stats by app id and date
    return client.query(storedProcedureApp);
  })
  .then((result) => {
    // install procedure to compile server stats by server id and date
    return client.query(storedProcedureServer);
  })
  .then((result) => {
    username = process.argv[2];
    console.log('Initializing Servers and Apps');
    return client.query('INSERT INTO "users" ("username") VALUES (${username}) ON CONFLICT ("username") DO UPDATE SET username = ${username} RETURNING id',
      { username: username });
  })
  .then((result) => {
    console.log('Inserted user ' + username + ' ', result);
    userID = result[0].id;
    
    let saveProgress = [];
    /* save apps and servers */
    for (let serverName of serverNames) {
      let thisServer = new server(userID, serverName);
      thisServer.randomizeIP();
      saveProgress.push(thisServer.save(client));
      servers.push(thisServer);
    }

    for (let appName of appNames) {
      let thisApp = new app(userID, appName);
      let maxRoutesApp = Math.ceil(Math.random() * maxRoutes); // max 50 routes
      let maxDepthApp = Math.ceil(Math.random() * maxDepth); // max 5 depth
      thisApp.buildRoutes(maxRoutesApp, maxDepthApp, randomRoute);
      saveProgress.push(thisApp.save(client));
      apps.push(thisApp);
    }
    
    return Promise.all(saveProgress);
  })
  .then((result) => {
    // don't really care about result just execute the next step.
    compileStats();
  })
  .catch((error) => {
    console.log('ERROR: Fatal ', error);
    process.exit();
  });

