"use strict";
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const request = require('superagent');
const router = express.Router();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const util = require('util');

const authRouter = require('./auth.js');

let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');
app.use(morgan('combined'));
app.use(methodOverride());
app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('oh no')); // handle error
  }
  next(); // otherwise continue
});

router.get('/', (req, res) => {
  let name;
  if (req.session) {
    name = req.session.name;
  }
  res.render('index', { user: name });
});

router.get('/packages', (req, res) => {
  request
  .get('https://search.apps.ubuntu.com/api/v1/snaps/search')
  .set('X-Ubuntu-Series', '16')
  .set('Accept', 'application/hal+json')
  .end((err, res2) => {
    console.log(res2.body);
    res.render('index');
  })

});

app.use('/', router);
app.use('/login', authRouter);

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  util.log('try-auth app listening at http://%s:%s', host, port);
});
