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

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')

const authRouter = require('./auth.js');
const cpi = require('./lib/cpi');

let app = express();
app.use(express.static('public'));

const compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

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

router.get('/api/search/:series/:channel/:name?/:arch?', (req, res, next) => {
  cpi.search(req.params.name, function(result) {
    req.body = result;
    next();
  }, {
    series: req.params.series,
    arch: req.params.arch,
    channel: req.params.channel
  });

}, function(req, res) {
  res.send(req.body);
});

app.use('/', router);
app.use('/login', authRouter);

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  util.log('try-auth app listening at http://%s:%s', host, port);
});
