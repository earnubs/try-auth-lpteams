'use strict';
import React from 'react';
import express, { Router } from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import util from 'util';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';

import configureStore from '../client/store/configureStore';
import apiRouter from './api.js';
import config from '../webpack.prod.config';
import cpi from '../lib/cpi';
import routes from '../client/routes';

const router = Router();

const app = express();
const compiler = webpack(config);

app.use(helmet());

if (!(process.env.NODE_ENV === 'production')) {
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true,
    publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
app.use(express.static('public'));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');
app.use(morgan('combined'));
app.use(methodOverride());

router.get('/snap/:series/:arch/:id', (req, res, next) => {
  cpi.snap(req.params.id, function(result) {
    req.body = result;
    next();
  }, {
    series: req.params.series,
    arch: req.params.arch
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

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error){
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      const finalState = store.getState();

      req.renderedHtml = html;
      req.finalState = finalState || '';

      res.render('index', { html: req.renderedHtml, state: req.finalState });
    } else {
      res.status(404).send('Not found');
    }
  });
});

router.get('/', (req, res) => {
  const store = configureStore();

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error){
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      const finalState = store.getState();

      req.renderedHtml = html;
      req.finalState = finalState;

      res.render('index', { html: req.renderedHtml, state: req.finalState });
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.use('/', router);
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  util.log('try-auth app listening at http://%s:%s', host, port);
});
