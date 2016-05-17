const session = require('express-session');
const methodOverride = require('method-override');
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient();

const configRoutes = function(app, passport) {

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(methodOverride());
  app.use(session({
    store: new RedisStore({
      url: process.env.REDIS_CONNECTION_STRING,
      db: 1,
      client: redisClient,
    }),
    cookie: { maxAge: (24 * 3600 * 1000 * 30) },
    secret: 'my_precious',
    resave: false,
    saveUninitialized: false,
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
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      }
      console.log('logout endpoint called!')
      // res.clearCookie('il');
      res.redirect('/login');
    });
  });
};

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated() || process.env.testing === 'true') { return next(); }
  console.log('failed auth');
  res.status(401);
  res.end();
};

exports.configRoutes = configRoutes;