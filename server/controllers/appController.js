var App = require('../db/models/client-app.js');
var Apps = require('../db/collections/client-apps.js');


module.exports = {

  getUserApps: (req, res) => {
    console.log('IN USER APPS!!!!!')
    console.log(req.session.passport.user.githubid);

    var id = req.session.passport.user.githubid;
    new App({ githubid: id})
      .fetch()
      .then(function(apps) {
        console.log(apps);
        res.send(200);
      })
      .catch(function(err){
        res.send(401);
      });
  },
};
