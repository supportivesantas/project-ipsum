const session = require('express-session');
const methodOverride = require('method-override');

var configRoutes = function(app, passport) {

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(methodOverride());
  app.use(session({ 
    secret: 'my_precious',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github',
    passport.authenticate('github', { scopes: ['user'] }));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.cookie('il', 'true', { httpOnly: false });

      res.redirect('/');
    });

  app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });
}

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

exports.configRoutes = configRoutes;