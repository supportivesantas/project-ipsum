"use strict";
const User = require('../db/models/user');
const Users = require('../db/collections/users');
const App = require('../db/models/client-app.js');
const Apps = require('../db/collections/client-apps.js');
const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');
const Hashes = require('../db/collections/hashes');
const Creds = require('../db/collections/service-creds');
const internalTasks = require('./internal_tasks');

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
        var appData = [];
        for (var i = 0; i < apps.models.length; i++) {
          appData.push(apps.models[i].attributes);
        }
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
        let servData = [];
        for (let i = 0; i < servers.models.length; i++) {
          servData.push(servers.models[i].attributes);
        }
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

  postUserServers: (req, res) => {
    console.log('Post to user servers');
    var userID = req.user.id;
    var serverID = req.body.server_id;

    if (userID === undefined || serverID === undefined) {
      console.log('ERROR: Missing parameter in postUserServers');
      res.status(404).end();
      return;
    }
    
    Servers.query('where', 'users_id', '=', req.user.id, 'AND',
      'clientServers_id', '=', serverID).fetch()
      .then((result_servers) => {
        if (!result_servers || !result_servers.length) {
          throw 'No Server Found';
        }
        // only care about the first result
        let server = result_servers[0];
        
        
      });
  },

  postUserCreds: (req, res) => {
    console.log('post user creds');
    // var userID = req.user.id;
    var userID = 1;
    var platform = req.body.platform;
    var value = req.body.value;

    if (userID === undefined || platform === undefined || value === undefined) {
      console.log('ERROR: Missing parameter in postUserCreds');
      res.status(404).end();
      return;
    }

    Creds.model.where({
      users_id: userID,
      platform: platform,
      value: value
    }).fetch()
      .then((credential) => {
        if (!credential) {
          return new Creds.model({
            users_id: userID,
            platform: platform,
            value: value
          }).save();
        } else {
          return credential;
        }
      })
      .then((credential) => {
        res.status(200).json(credential.id);
        internalTasks.syncServersToPlatforms(userID);
      })
      .catch((error) => {
        console.log('ERROR: Failed to insert into userCreds table', error);
        res.status(500).end();
      });
  },

  putUserCreds: (req, res) => {
    console.log('put user creds');
    // var userID = req.user.id;
    var userID = 1;
    var id = req.body.id;
    var platform = req.body.platform;
    var value = req.body.value;

    if (userID === undefined || platform === undefined || value === undefined) {
      console.log('ERROR: Missing parameter in postUserCreds');
      res.status(404).end();
      return;
    }

    Creds.model.where({
      users_id: userID,
      id: id
    }).fetch()
      .then((credential) => {
        if (!credential) {
          throw 'Credential Not Found';
        } else {
          credential.set('platform', platform);
          credential.set('value', value);
          return credential.save();
        }
      })
      .then((credential) => {
        res.status(200).json(credential.id);
        internalTasks.syncServersToPlatforms(userID);
      })
      .catch((error) => {
        console.log('ERROR: Failed to insert into userCreds table', error);
        res.status(500).end();
      });
  },

  getUserCreds: (req, res) => {
    console.log('Get user creds');
    // var userID = req.user.id;
    var userID = 1;

    if (userID === undefined) {
      console.log('ERROR: Missing Parameter');
      res.status(404).end();
      return;
    }

    Creds.model.where({ users_id: userID }).fetchAll()
      .then((results) => {
        let credentials = [];
        
        results.each((credential) => {
          credentials.push({
            id: credential.get('id'),
            platform: credential.get('platform'),
            value: credential.get('value')
          });
        });
        res.status(200).json(credentials);
      })
      .catch((error) => {
        console.log('ERROR: Failed to retrieve credentials for user', error);
        res.status(500).end();
      });
  },

deleteUserCreds: (req, res) => {
  console.log('Delete user creds');
    // let userID = req.user.id;
    let userID = 1;
    let credsIDs = req.body.ids;

    if (userID === undefined || credsIDs == undefined) {
      console.log('ERROR: Missing Parameters');
      res.status(404).end();
      return;
    }

    for (let credID of credsIDs) {
      Creds.model.where({ users_id: userID, id: credID }).fetch()
        .then((cred) => {
          return cred.destroy();
        })
        .then((result) => {
          // res.status(200).end();
        })
        .catch((error) => {
          console.log('ERROR: Failed to retrieve credentials for user', error);
          res.status(500).end();
        });
    }
    res.status(200).end();
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
            // platform: curServer.platform,
            platform: 'Digital Ocean',
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
