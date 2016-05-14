"use strict";
const checkCtrl = require('../controllers/rebalanceController.js');
const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');
const LoadBalancer = require('../db/models/loadbalancer.js');
const LoadBalancers = require('../db/collections/loadbalancers.js');
const internalTasks = require('../controllers/internal_tasks');
const _ = require('underscore');
const Promise = require('bluebird');
const redis = require("redis");



Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({detect_buffers: true});

const doOneLb = (id) => {
  return new Promise((resolve, reject) => {
    checkCtrl.checkThresholds(id, (order) => {
      resolve(order);
    });
  });
};

const checkAll = () => {
  return LoadBalancers.fetch()
    .then((balancers) => {
      return Promise.all(balancers.models.map( (item, index) => {
        return doOneLb(item.attributes.id)
          .then((order) => {
            if (order === 'incr') {
              //SPIN UP NEW SERVER
              return internalTasks.spinUpServerInLB(item.get('id'))
                .then((result) => {
                  // store the time we spin up a server for this LB ID
                  return client.hsetAsync('cooldown', item.get('id'), Date.now());
                })
                .catch((error) => {
                  console.log('ERROR: Failed to spin up and attach server for LB: ' + item.get('id'), error);
                });
            } else if (order === 'decr') {
              //DESTROY A SERVER
              return client.hgetAsync('cooldown', item.get('id'))
                .then((value) => {
                  if (value) {
                    let timeDiff = (Date.now() - value) / 1000 / 60; // diff in time in minutes
                    if (timeDiff <= 120) {
                      // lockout spindown by 2 hours
                      console.log('Inside lockout period for spin down.  Do nothing.');
                      return true;
                    }
                  }
                  return internalTasks.unhookAndDestoryServer(item.get('id'));
                })
                .then((result) => {
                  console.log('SUCCESSFULLY REMOVED SERVER FROM LB');
                })
                .catch((error) => {
                  console.log('ERROR: Failed to unhook and destroy server for LB: ' + item.get('id'), error);
                });
            } else {
              console.log('no modification necessary for lb with id - ', item.attributes.id);
              if (index === balancers.models.length - 1) {
                // dont throw an error so we resolve the rest of the promises for other models
                return true;
              }
            }
          });
      }));
    })
    .catch((err) => {
      console.log(err);
    });
};

const doAll = () => {
  return checkAll();
  // return new Promise((resolve, reject) => {
  //   checkAll(() => {
  //     resolve();
  //   });
  // });
};

doAll()
.then(() => {
  console.log('All Done');
  process.exit(1);
});
