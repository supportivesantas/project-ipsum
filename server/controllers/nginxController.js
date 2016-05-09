const util = require('util');
const exec = require('child_process').exec;
const LoadBalancer = require('../db/models/loadbalancer.js');
const LoadBalancers = require('../db/collections/loadbalancers.js');

const log = function(error, stdout, stderr) {
  console.log(stdout);
};

module.exports = {

  //NEED TO GET ID FOR REMOVE

  list(nginxipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?upstream=" + zone + "&verbose=", log);
  },
  enable(nginxipandport, targetipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?upstream=" + zone + "&server=" + targetipandport + "&up=", log);
  },
  disable(nginxipandport, targetipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?upstream=" + zone + "&server=" + targetipandport + "&down=", log);
  },
  add(nginxipandport, targetipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?add=&upstream=" + zone + "&server=" + targetipandport, log);
  },
  remove(nginxipandport, id, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?remove=&upstream=" + zone + "&id=" + id, log);
  },

  newLoadBalancer(req, res) {
    const data = req.body;
    LoadBalancer.where({ ip: data.ip }).fetch()
      .then((lb) => {
        console.log(lb);
        if (!lb) {
          new LoadBalancer({
            ip: data.ip,
            port: data.port,
            zone: data.zone,
            users_id: data.ownerId,
          })
          .save()
          .then((newlb) => {
            //DO AUTO DISCOVERY
            console.log('DONE');
            res.send();
          });
        }
      });
  },

};

