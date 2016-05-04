const User = require('../db/models/user');
const Users = require('../db/collections/users');


module.exports = {

  getUserData: (req, res) => {
    console.log('IN USER DATA!!!!!')
    console.log(req.session.passport.user.githubid);

    res.send(req.session.passport.user.githubid);
  },
};
