"use strict";
import RedisConnect from 'connect-redis';
import express, { Router } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import request from 'superagent';
import session from 'express-session';
import util from 'util';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import { fetchSnapIfNeeded } from '../client/actions';
import configureStore from '../client/store/configureStore';
import App from '../client/containers/App';

import authRouter from '../auth.js';
import config from '../webpack.config';
import cpi from '../lib/cpi';

const router = Router();

const RedisStore = RedisConnect(session);
const app = express();
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  noInfo: true,
  publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
app.use(express.static('public'));

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

router.get('/api/snap/:id', (req, res, next) => {
  cpi.snap(req.params.id, function(result) {
    req.body = result;
    next();
  });

}, function(req, res) {
  res.send(req.body);
});

router.get('/snap/:id?', (req, res, next) => {
  cpi.snap(req.params.id, function(result) {
    req.body = result;
    next();
  });
}, (req, res) => {

  const initialState = {
    snapById: {
      [req.params.id]: {
        isFetching: false,
        snap: req.body,
        lastUpdated: Date.now()
      }
    }
  };
  const store = configureStore(initialState);
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const finalState = store.getState();

  req.renderedHtml = html;
  req.finalState = finalState;

  res.render('index', { html: req.renderedHtml, state: req.finalState });

});

app.use('/', (req, res, next) => {
  const store = configureStore();
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const finalState = store.getState();

  req.renderedHtml = html;
  req.finalState = finalState;

  next();
});

app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('no session, boo!'));
  }
  next();
});

router.get('/', (req, res) => {
  let name;
  if (req.session) {
    name = req.session.name;
  }
  const store = configureStore();
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const finalState = store.getState();

  req.renderedHtml = html;
  req.finalState = finalState;
  res.render('index', { user: name, html: req.renderedHtml, state: req.finalState });
});


app.use('/', router);
app.use('/login', authRouter);

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  util.log('try-auth app listening at http://%s:%s', host, port);
});
