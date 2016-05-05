"use strict";
const User = require('../db/models/user');
const Users = require('../db/collections/users');
const App = require('../db/models/client-app.js');
const Apps = require('../db/collections/client-apps.js');
const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');
const Hashes = require('../db/collections/hashes');

module.exports = {

  getUserId: (req, res) => {
    console.log('IN USER DATA!!!!!');
    console.log(req.session.passport.user.githubid);

    res.send(req.session.passport.user.githubid);
  },

  getUserApps: (req, res) => {
    console.log('IN USER APPS!!!!!');
    Apps.query('where', 'users_id', '=', req.user.id).fetch()
      .then(function(apps) {
        console.log(apps);
        var appData = [];
        for (var i = 0; i < apps.models.length; i++) {
          appData.push(apps.models[i].attributes);
        }
        console.log(appData);
        res.status(200).send(appData);
      });

    // var id = req.session.passport.user.githubid;
    // App.where({ githubid: id})
    //   .fetch()
    //   .then((apps) => {
    //     console.log(apps);
           // var appData = [];
           // for (var i = 0; i < apps.length; i++) {
           //   appData.push(apps[i].attributes);
           // }
           // console.log(appData);
           // res.status(200).send(appData);
    //   })
    //   .catch((err) => {
    //     res.send(401);
    //   });
  },

  getUserServers: (req, res) => {
    console.log('IN USER SERVS!!!!!');
    Servers.query('where', 'users_id', '=', req.user.id).fetch()
      .then((servers) => {
        console.log(servers);
        let servData = [];
        for (let i = 0; i < servers.models.length; i++) {
          servData.push(servers.models[i].attributes);
        }
        console.log(servData);
        res.status(200).send(servData);
      });

    // var id = req.session.passport.user.githubid;
    // Server.where({ githubid: id})
    //   .fetch()
    //   .then((servers) => {
    //     console.log(servers);
           // var servData = [];
           // for (var i = 0; i < servers.length; i++) {
           //   servData.push(servers[i].attributes);
           // }
           // console.log(servData);
           // res.status(200).send(servData);
    //   })
    //   .catch((err) => {
    //     res.send(401);
    //   });
  },

  getInit: (req, res) => {
    let serverQuickLook = {};
    const servData = [];
    
    Servers.query('where', 'users_id', '=', req.user.id, 'orderBy', 'id', 'ASC').fetch()
      .then((servers) => {
        
        for (let i = 0; i < servers.models.length; i++) {
          // servData.push(servers.models[i].attributes);
          let curServer = servers.models[i].attributes;

          let serverAttrib = {
            id: curServer.id,
            hostname: curServer.hostname,
            ip: curServer.ip,
            platform: curServer.platform,
            active: 'active', // fix me later
            apps: []
          };

          servData.push(serverAttrib);
          /* store into quick lookup object */
          serverQuickLook[curServer.id] = serverAttrib;
        }
        // console.log(servData);
        
        /* query hashes table and filter only server/app id and appnames */
        return Hashes.query('where', 'users_id', '=', req.user.id, 'orderBy', 'id', 'ASC')
          .fetch({
            withRelated: [{
              'clientApps': (qb) => {
                qb.column('appname');
              }
            }], columns: ['clientServers_id', 'clientApps_id', 'appname']
          });
      })
      .then((hashesResult) => {
        hashesResult.each((hash) => {
          var hashAttrib = hash.attributes;

          if (hashAttrib.clientServers_id === undefined || !hashAttrib.appname) {
            return;
          }

          /* push appname into array */
          var appDescription = [hashAttrib.clientApps_id, hashAttrib.appname];
          serverQuickLook[hashAttrib.clientServers_id].apps.push(appDescription);
        });
        
        return Apps.query('where', 'users_id', '=', req.user.id).fetch();
      })
      .then((apps) => {
        const appData = [];
        for (let i = 0; i < apps.models.length; i++) {
          appData.push(apps.models[i].attributes);
        }
        // console.log(appData);
        res.status(200).json({ servers: servData, apps: appData });
      })
      .catch((error) => {
        console.log('ERROR: Failed to get init data', error);
        res.status(500).send(error);
      });

    // const id = req.session.passport.user.githubid;
    // Server.where({ githubid: id})
    //   .fetch()
    //   .then((servers) => {
    //     console.log(servers);
           // const servData = [];
           // for (let i = 0; i < servers.length; i++) {
           //   servData.push(servers[i].attributes);
           // }
           // App.where({ githubid: id})
           //   .fetch()
           //   .then((apps) => {
           //     console.log(apps);
                  // const appData = [];
                  // for (let i = 0; i < apps.length; i++) {
                  //   appData.push(apps[i].attributes);
                  // }
                  // console.log(appData);
                  // res.status(200).send({ servers: servData, apps: appData });
           //   })
           //   .catch((err) => {
           //     res.send(401);
           //   });
    //   })
    //   .catch((err) => {
    //     res.send(401);
    //   });


  },

};
