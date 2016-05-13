const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// const GITHUB_CLIENT_ID = "--insert-github-client-id-here--";
// const GITHUB_CLIENT_SECRET = "--insert-github-client-secret-here--";

const GITHUB_CLIENT_ID = '339d89727f88765571b3';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

var User = require('../db/models/user');


module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    console.log('SERIALIZING SESSION')
    done(null, {githubid: user.get('githubid')});
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    console.log('DESERIALIZING SESSION')
    new User({ githubid: id})
      .fetch()
      .then(function(user) {
        var theuser = user.attributes;
        done(null, theuser);
      })
      .catch(function(err){
        done(err, null);
      });
  });

  passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production' ? "http://djdeploy.com/auth/github/callback" : "http://localhost:1337/auth/github/callback"
    },
    function(token, refreshToken, profile, done) {
      new User({username: profile.username}).fetch()
      .then(function(user){
        if (!user) { user = new User(); console.log('User not found, creating a new one!')}
        // if there is a user id already but no token (user was linked at one point and then removed)
        if (! (user.get('githubtoken') && user.get('githubemail') && user.get('githubid') )) {
          user.save({
            username: profile.username,
            githubtoken: token,
            githubemail: (profile._json.email || '').toLowerCase(),
            githubid: profile.id
          })
          .then(function(user){
            return done(null, user);
          })
          .catch(function(err){
            return done(err, null);
          });
        }

        return done(null, user); // user found, return that user
      });
    }));
}
