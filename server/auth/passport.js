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
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    new User({'github.id': id})
      .fetch()
      .then(function(user) {
        done(err, user)
      });
  });

  passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:1337/auth/github/callback"
    },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {

        new User({'github.id': profile.id}).fetch(function(user){
          if (user) {

            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.github.token) {
              // need to add columns to schema...
              user[githubToken] = token;
              user[githubEmail] = (profile.email || '').toLowerCase();

              user.save(function(err) {
                if (err)
                    return done(err);
                    
                return done(null, user);
              });
            }

            return done(null, user); // user found, return that user

          } else {
            // if there is no user, create them
            var newUser            = new User();

            newUser.github.id    = profile.id;
            newUser.github.token = token;
            newUser.github.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.github.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function(err) {
              if (err)
                return done(err);
                  
              return done(null, newUser);
            });
          }

        });

      });

    }));


}
