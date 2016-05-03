const session = require('express-session');

module.exports = function(app, passport) {

  app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] }),
    function(req, res){
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    });

  // GET /auth/github/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


}