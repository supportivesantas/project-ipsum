var clientApps = require('../db/collections/client-apps');
var Server = require('../db/models/client-server');
var Servers = require('../db/collections/client-server');
var stats = require('../db/collections/stats');
var _ = require('underscore');
var ctrl = require('../controllers/summaryController.js');
const pgp = require('pg-promise')({});

// var db = require('bookshelf')(knex);
var client = pgp({
  connectionString: process.env.PG_CONNECTION_STRING,
});

const generateServerSummaries = () => {
  let count = 0;
  ctrl.getAllServerIds((serverList) => {
    const summaries = [];
    for (let i = 0; i < serverList.length; i++) {
      ctrl.singleServerSummary(serverList[i], (data) => {
        for (let j = 0; j < data.length; j++) {
          if (data[j].route !== 'Total') {
            const hits = _.reduce(data[j].data, (memo, dataPoint) => {
              return memo + dataPoint.hits;
            }, 0);
            count++;
            console.log('Server Summary #' + count + ' generated');
            summaries.push({
              serverid: serverList[i],
              route: data[j].route,
              value: hits,
              day: new Date(), //create stamp automagically by postgres?
            });
          }
        }
      });
    }
    //have to do timeout to wait for summaries to generate
    setTimeout(() => {
      console.log(summaries.length);
      client.tx(t=>t.batch(summaries.map(l=>t.none(
            `INSERT INTO serversummaries(serverid, route, value, day)
             VALUES($[serverid], $[route], $[value], $[day])`, l))))
          .then(data=> {
              // SUCCESS;
              // data = array of undefined
              console.log('SUCCESS!');
          })
          .catch(error=> {
              // ERROR;
              console.log(error);
          });
      
    }, 12000);
  });
};

const populateDatabase = () => {

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



