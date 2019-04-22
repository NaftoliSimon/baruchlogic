const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { query } = require('./db');
const cors = require('cors');
const configApp = require('./config');
const configEndpoints = require('./api');
const corsWithOptions = require('./config/cors');

const app = express();

const SECRET = 'cats';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));
app.use(
  session({
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
    secret: SECRET,
    sameSite: false,
    resave: false,
    saveUninitialized: true
  })
);

app.use(corsWithOptions);
app.options('*', corsWithOptions);

configApp(app);

configEndpoints(app);

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
