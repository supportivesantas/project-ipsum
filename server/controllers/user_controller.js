const User = require('../db/models/user');
const Users = require('../db/collections/users');
const App = require('../db/models/client-app.js');
const Apps = require('../db/collections/client-apps.js');
const Server = require('../db/models/client-server.js');
const Servers = require('../db/collections/client-server.js');

module.exports = {

  getUserId: (req, res) => {
    console.log('IN USER DATA!!!!!')
    console.log(req.session.passport.user.githubid);

    res.send(req.session.passport.user.githubid);
  },

  getUserApps: (req, res) => {
    console.log('IN USER APPS!!!!!')
    Apps.fetch()
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
    console.log('IN USER SERVS!!!!!')
    Servers.fetch()
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
    // const id = req.session.passport.user.githubid;
    Servers.fetch()
      .then((servers) => {
        const servData = [];
        for (let i = 0; i < servers.models.length; i++) {
          servData.push(servers.models[i].attributes);
        }
        console.log(servData);
        Apps.fetch()
          .then((apps) => {
            const appData = [];
            for (let i = 0; i < apps.models.length; i++) {
              appData.push(apps.models[i].attributes);
            }
            console.log(appData);
            res.status(200).send({ servers: servData, apps: appData });
          });
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
