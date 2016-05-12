const checkCtrl = require('../controllers/rebalanceController.js');
const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');
const LoadBalancer = require('../db/models/loadbalancer.js');
const LoadBalancers = require('../db/collections/loadbalancers.js');
const _ = require('underscore');
const Promise = require('bluebird');


const doOneLb = (id) => {
  return new Promise((resolve, reject) => {
    checkCtrl.checkThresholds(id, (order) => {
      resolve(order);
    });
  });
};

const checkAll = (cb) => {
  LoadBalancers.fetch()
    .then((balancers) => {
      _.each(balancers.models, (item, index) => {
        doOneLb(item.attributes.id)
          .then((order) => {
            if (order === 'incr') {
              //SPIN UP NEW SERVER
              console.log('Increase speed to warp factor 8, Mr. Scott!');
              if (index === balancers.models.length - 1) {
                cb();
              }
            } else if (order === 'decr') {
              //DESTROY A SERVER
              console.log('Decrease to 1/2 impulse! Shields up! Red Alert!');
              if (index === balancers.models.length - 1) {
                cb();
              }
            } else {
              console.log('no modification necessary for lb with id - ', item.attributes.id);
              if (index === balancers.models.length - 1) {
                cb();
              }
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const doAll = () => {
  return new Promise((resolve, reject) => {
    checkAll(() => {
      resolve();
    });
  });
};

doAll()
.then(() => {
  console.log('All Done');
  process.exit(1);
});
