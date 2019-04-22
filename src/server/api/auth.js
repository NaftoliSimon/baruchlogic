const passport = require('passport');
const corsWithOptions = require('../config/cors');

const configAuthRoutes = app => {
  app.post(
    '/api/login',
    corsWithOptions,
    passport.authenticate('local'),
    (req, res) => {
      console.log('LOGIN', req.body);
      console.log('user', req.user);
      console.log('cookies', req.cookies);
      console.log('session', req.session);
      // console.log("res", res);
      const {
        body: { key }
      } = req;
      console.log('key', key);
      console.log('isAuthenticated', req.isAuthenticated());
      res.status(200).send(req.session);
    }
  );

  app.get('/api/auth', (req, res) => {
    console.log('AUTH', req.user);
    console.log('session', req.session);
    console.log('user', req.user);
    console.log('IS AUTH', req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.send('true');
    } else {
      res.send('false');
    }
  });

  app.get('/api/logout', (req, res) => {
    console.log("LET'S LOG OUT");
    // console.log('req', req);
    console.log('user', req.user);
    console.log('session', req && req.session);
    console.log('isAuth?', req.isAuthenticated());
    req.logout();
    console.log(req.session);
    console.log('isAuth', req.isAuthenticated());
    res.sendStatus(200);
  });
};

module.exports = configAuthRoutes;
