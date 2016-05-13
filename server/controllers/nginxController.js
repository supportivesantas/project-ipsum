"use strict";
const util = require('util');
const exec = require('child_process').exec;
const LoadBalancer = require('../db/models/loadbalancer.js');
const LoadBalancers = require('../db/collections/loadbalancers.js');
const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');
var requestP = require('request-promise');
var Promise = require('bluebird');

var log = function(error, stdout, stderr) {
  console.log(stdout);
};
const _ = require('underscore');

module.exports = {

  //NEED TO GET ID FOR REMOVE

  listParsed(nginxipandport, zone) {
    let options = {
      uri: 'http://' + nginxipandport + '/upstream_conf',
      qs: {
        upstream: zone,
        verbose: ''
      }
    };

    return requestP(options)
      .then((result) => {
        let servers = [];
        let parseServerInfo = /server ([0-9\.]+):([0-9]+).*id=([0-9]+)/g;
        let serverInfo = null;
        while (serverInfo = parseServerInfo.exec(result)) {
          servers.push({
            ip: serverInfo[1],
            port: serverInfo[2],
            id: serverInfo[3]
          });
        }

        return servers;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  },
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
    let options = {
      // don't use qs for this one since query string ascii convers the : in the server which nginx does not like
      uri: 'http://' + nginxipandport + '/upstream_conf?add=&upstream=' + zone + '&server=' + targetipandport,
    };
    return requestP(options);
    // exec("curl http://" + nginxipandport + "/upstream_conf?add=&upstream=" + zone + "&server=" + targetipandport, log);
  },
  remove(nginxipandport, zone, id) {
    // exec("curl http://" + nginxipandport + "/upstream_conf?remove=&upstream=" + zone + "&id=" + id, log);
    let options = {
      uri: 'http://' + nginxipandport + '/upstream_conf?remove=',
      qs: {
        upstream: zone,
        id: id
      }
    };

    return requestP(options)
    .then(function(result){
      let servers = [];
      let parseServerInfo = /server ([0-9\.]+):([0-9]+).*id=([0-9]+)/g;
      let serverInfo = null;
      while (serverInfo = parseServerInfo.exec(result)) {
        servers.push({
          ip: serverInfo[1],
          port: serverInfo[2],
          id: serverInfo[3]
        });
      }
      return servers;
    })
    .catch((error) => {
      console.log(error);
      return;
    });
  },

  newLoadBalancer(req, res) {
    const data = req.body;
    LoadBalancer.where({ users_id: req.user.id, ip: data.ip }).fetch()
      .then((lb) => {
        if (!lb) {
          new LoadBalancer({
            ip: data.ip,
            port: data.port,
            zone: data.zone,
            image: +data.image,
            users_id: req.user.id,
            min_threshold: data.min_threshold || 10000,
            max_threshold: data.max_threshold || 50000,
            max_servers: data.max_servers || 5,
          })
          .save()
          .then((newlb) => {
            //DO AUTO DISCOVERY
            res.send('success');
          });
        } else {
          res.send('That server has already been added');
        }
      }).
      catch((error) => {
        console.error("Could not add load balancer", error);
      });
  },

  addSlave(req, res) {
    Server.where({ id: req.body.id }).fetch()
      .then((server) => {
        server.set('master', req.body.master)
        .save()
        .then(() => {
          res.send('success');
        })
        .catch((err) => {
          console.log(err);
          res.send('Error');
        });
      });
  },

  removeLoadBalancer(req, res) {
    LoadBalancer.where({ id: req.body.id }).fetch()
      .then((lb) => {
        const lbid = lb.id;
        if (!lb) {
          res.send('Load Balancer with id ' + req.body.id + ' not found');
        }
        lb.destroy()
          .then(() => {
            Servers.query('where', 'master', '=', lbid).fetch()
              .then((servers) => {
                _.each(servers.models, (item, index) => {
                  item.set('master', null)
                  .save();
                });
              })
              .then(() => {
                res.send('Great Success!');
              });
          });
      });
  },

  getLoadBalancers(req, res) {
    LoadBalancer.where({users_id: req.user.id}).fetchAll()
      .then((LoadBalancers) => {
        res.send(LoadBalancers);
      });
  },

};
