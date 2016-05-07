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
  let count = 0;
  return new Promise((resolve, reject) => {
    ctrl.getAllServerIds((serverList) => {
      for (let i = 0; i < serverList.length; i++) {
        ctrl.singleServerSummary(serverList[i], (data) => {
          for (let j = 0; j < data.length; j++) {
            if (data[j].route !== 'Total') {
              const hits = _.reduce(data[j].data, (memo, dataPoint) => {
                return memo + dataPoint.hits;
              }, 0);
              console.log('Server Summary #' + count++ + ' generated');
              servsummaries.push({
                serverid: serverList[i],
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
  let count = 0;
  return new Promise((resolve, reject) => {
    ctrl.getAllAppIds((appIds) => {
      for (let i = 0; i < appIds.length; i++) {
        ctrl.singleApp(appIds[i], (data) => {
          for (let j = 0; j < data.length; j++) {
            if (data[j].route !== 'Total') {
              const hits = _.reduce(data[j].data, (memo, dataPoint) => {
                return memo + dataPoint.hits;
              }, 0);
              console.log('App Summary #' + count++ + ' generated');
              appsummaries.push({
                appid: appIds[i],
                route: data[j].route,
                value: hits,
                day: day,
                month: month,
                year: year,
              });
              if (i === appIds.length - 1 && j === data.length - 1) {
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
                  `INSERT INTO serversummaries(serverid, route, value, day, month, year)
                   VALUES($[serverid], $[route], $[value], $[day], $[month], $[year])`, l))))
                .then((data) => {
                    // data = array of undefined
                  console.log('Server summaries added to DB!');
                  db.tx((t1) => t1.batch(appsummaries.map((l) => t1.none(
                        `INSERT INTO appsummaries(appid, route, value, day, month, year)
                         VALUES($[appid], $[route], $[value], $[day], $[month], $[year])`, l))))
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

