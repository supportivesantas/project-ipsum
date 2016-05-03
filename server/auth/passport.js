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
    done(null, {'githubid': user.get('githubid')});
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    console.log('DESERIALIZING SESSION')
    new User({'githubid': id})
      .fetch()
      .then(function(user) {
        console.log(user);
        done(null, user)
      })
      .catch(function(err){
        done(err);
      });
  });

  passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:1337/auth/github/callback"
    },
    function(token, refreshToken, profile, done) {

      new User({'githubid': profile.id}).fetch()
      .then(function(user){
        if (!user) { user = new User(); console.log('User not found, creating a new one!')}
        // if there is a user id already but no token (user was linked at one point and then removed)
        if (! (user.get('githubtoken') && user.get('githubemail') && user.get('githubid') )) {
          user.save({
            githubtoken: token,
            githubemail: (profile._json.email || '').toLowerCase(),
            githubid: profile.id
          })
          .then(function(user){
            return done(null, user);
          })
          .catch(function(err){
            return done(err);
          });
        }

        return done(null, user); // user found, return that user
      });
    }));
}
