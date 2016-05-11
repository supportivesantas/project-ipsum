const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');
const LoadBalancer = require('../db/models/loadbalancer.js');
const LoadBalancers = require('../db/collections/loadbalancers.js');
const summCtrl = require('./summaryController.js');
const _ = require('underscore');
const Promise = require('bluebird');

module.exports = {

  generateSlaveTotals(slaves) {
    let total = 0;
    return new Promise((resolve, reject) => {
      _.each(slaves.models, (item, sindex) => {
        summCtrl.singleServerSummary(item.attributes.id, (data) => {
          // console.log(data);
          for (let i = 0; i < data.length; i++) {
            if (data[i].route === 'Total') {
              _.each(data[i].data, (hrData, dindex) => {
                total += hrData.hits;
                if (sindex === slaves.models.length - 1 && dindex === data[i].data.length - 1) {
                  resolve(total);
                }
              });
              break;
            }
          }
        });
      });
    });
  },

  checkThresholds(id) {
    let numSlaves;
    LoadBalancer.where({ id: id }).fetch()
      .then((balancer) => {
        const min = balancer.attributes.min_threshold;
        const max = balancer.attributes.max_threshold;
        Servers.query('where', 'master', '=', balancer.attributes.id).fetch()
          .then((slaves) => {
            numSlaves = slaves.models.length;
            module.exports.generateSlaveTotals(slaves)
              .then((slaveTotals) => {
                if (slaveTotals >= max) {
                  return 'incr';
                } else if (slaveTotals <= min && numSlaves > 1) {
                  return 'decr';
                } else {
                  return false;
                }
              });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};



