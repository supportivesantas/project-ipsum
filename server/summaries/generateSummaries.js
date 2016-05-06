var clientApps = require('../db/collections/client-apps');
var Server = require('../db/models/client-server');
var Servers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var _ = require('underscore');
var ctrl = require('../controllers/summaryController.js');
const pgp = require('pg-promise')({});
var Promise = require('bluebird');

// var db = require('bookshelf')(knex);
var client = pgp({
  connectionString: process.env.PG_CONNECTION_STRING,
});

const generateSummaries = () => {
  let count = 0;
  const servsummaries = [];
  const appsummaries = [];
  ctrl.getAllServerIds((serverList) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
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
          }
        }
      });
    }
    //have to do timeout to wait for summaries to generate
    setTimeout(() => {
      client.tx(t=>t.batch(servsummaries.map(l=>t.none(
            `INSERT INTO serversummaries(serverid, route, value, day, month, year)
             VALUES($[serverid], $[route], $[value], $[day], $[month], $[year])`, l))))
          .then(data=> {
              // data = array of undefined
              console.log('SUCCESS!');
              console.log('Server summaries generation complete!');
              console.log('Starting Generation of App Summaries');
              count = 0;
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
                      }
                    }
                  });
                }
                setTimeout(() => {
                  client.tx(t=>t.batch(appsummaries.map(l=>t.none(
                        `INSERT INTO appsummaries(appid, route, value, day, month, year)
                         VALUES($[appid], $[route], $[value], $[day], $[month], $[year])`, l))))
                      .then(data=> {
                          // data = array of undefined
                          console.log('SUCCESS!');
                          console.log('All Summaries Generated!');
                          console.log('Hail Hydra!');
                          process.exit(1);
                        })
                      .catch(error=> {
                          // ERROR;
                          console.log(error);
                          process.exit(0);
                      });
                }, 20000);
              });
          })
          .catch(error=> {
              // ERROR;
              console.log(error);
          });
    }, 20000);
  });
};

const populateDatabase = () => {

};

client.connect()
  .then((result) => {
    /* */
    console.log('Generating Server Summary Data');
    //function
    generateSummaries();

  })
  .catch((error) => {
    console.log('ERROR: Failed to connect to Postgres!', error)
  });



