const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;


if (process.env.NODE_ENV === 'production'){
  var GITHUB_CLIENT_ID = '3aef3c6212ed88f6ca56';
  var callbackURL = 'http://djdeploy.com/auth/github/callback';
} else {
  var GITHUB_CLIENT_ID = '3b2b57a04b678dd74de1';
  var callbackURL = 'http://localhost:1337/auth/github/callback';
}

var User = require('../db/models/user');

module.exports = function (passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    console.log('SERIALIZING SESSION');
    if (!user) {
      return done('ERROR: Failed to serialize user', null);
    }
    done(null, { githubid: user.get('githubid') });
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    console.log('DESERIALIZING SESSION');
    if (!id || !id.githubid) {
      return done('ERROR: Failed to deserialize user.', null);
    }
    new User({ githubid: id.githubid })
      .fetch()
      .then(function (user) {
        var theuser = user.attributes;
        done(null, theuser);
      })
      .catch(function (err) {
        done(err, null);
      });
  });

  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL
  },
    function (token, refreshToken, profile, done) {
      new User({ username: profile.username }).fetch()
        .then(function (user) {
          if (!user) { user = new User(); console.log('User not found, creating a new one!') }
          // if there is a user id already but no token (user was linked at one point and then removed)
          if (!(user.get('githubtoken') && user.get('githubemail') && user.get('githubid'))) {
            user.save({
              username: profile.username,
              githubtoken: token,
              githubemail: (profile._json.email || '').toLowerCase(),
              githubid: profile.id
            })
              .then(function (user) {
                return done(null, user);
              })
              .catch(function (err) {
                return done(err, null);
              });
          } else {
            return done(null, user); // user found, return that user 
          }
        });
    }));
};
