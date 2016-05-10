'use strict';
var clientApps = require('../db/collections/client-apps');
var Server = require('../db/models/client-server');
var Servers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var _ = require('underscore');
var ctrl = require('../controllers/summaryController.js');

var Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise,
});
var db = pgp(process.env.PG_CONNECTION_STRING);


const generateServSummaries = () => {
// const generateServSummaries = new Promise((resolve, reject) => {
  return new Promise((resolve, reject) => {
    ctrl.getAllServerIds((serverList) => {
      for (let i = 0; i < serverList.length; i++) {
        ctrl.singleServerSummary(serverList[i].id, (data) => {
          for (let j = 0; j < data.length; j++) {
            if (data[j].route !== 'Total') {
              const hits = _.reduce(data[j].data, (memo, dataPoint) => {
                return memo + dataPoint.hits;
              }, 0);
              servsummaries.push({
                serverid: serverList[i].id,
                users_id: serverList[i].owner,
                route: data[j].route,
                value: hits,
                day: day,
                month: month,
                year: year,
              });
              if (i === serverList.length - 1 && j === data.length - 1) {
                resolve();
              }
            }
          }
        });
      }
    });
  });
};
// const generateAppSummaries = new Promise((resolve, reject) => {
const generateAppSummaries = () => {
  return new Promise((resolve, reject) => {
    ctrl.getAllAppIds((appList) => {
      for (let i = 0; i < appList.length; i++) {
        ctrl.singleApp(appList[i].id, (data) => {
          for (let j = 0; j < data.length; j++) {
            if (data[j].route !== 'Total') {
              const hits = _.reduce(data[j].data, (memo, dataPoint) => {
                return memo + dataPoint.hits;
              }, 0);
              appsummaries.push({
                appid: appList[i].id,
                users_id: appList[i].owner,
                route: data[j].route,
                value: hits,
                day: day,
                month: month,
                year: year,
              });
              if (i === appList.length - 1 && j === data.length - 1) {
                resolve();
              }
            }
          }
        });
      }
    });
  });
};

const servsummaries = [];
const appsummaries = [];
const today = new Date();
today.setDate(today.getDate() - 1);
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

db.connect()
  .then(result => {
    /* */
    console.log('Generating Server Summary Data');
    //function
    // result.done(); // must release the connection here;
    generateServSummaries()
      .then(() => {
        console.log('Server summaries generation complete!');
        console.log('Starting Generation of App Summaries');
        generateAppSummaries()
          .then(() => {
            db.tx((t) => t.batch(servsummaries.map((l) => t.none(
                  `INSERT INTO serversummaries(serverid, users_id, route, value, day, month, year)
                   VALUES($[serverid], $[users_id], $[route], $[value], $[day], $[month], $[year])`, l))))
                .then((data) => {
                    // data = array of undefined
                  console.log('Server summaries added to DB!');
                  db.tx((t1) => t1.batch(appsummaries.map((l) => t1.none(
                        `INSERT INTO appsummaries(appid, users_id, route, value, day, month, year)
                         VALUES($[appid], $[users_id], $[route], $[value], $[day], $[month], $[year])`, l))))
                      .then((data) => {
                        // data = array of undefined
                        result.done(); // must release the connection here;

                        console.log('App summaries added to DB!');
                        console.log('All Finished!');
                        console.log('Hail Hydra!');
                        process.exit(1);
                      })
                      .catch((error) => {
                          // ERROR;
                          console.log(error);
                          process.exit(0);
                      });
                })
                  .catch((error) => {
                      // ERROR;
                      console.log(error);
                      process.exit(0);
                  });
          })
            .catch((error) => {
                // ERROR;
                console.log(error);
                process.exit(0);
            });
      });
  });

