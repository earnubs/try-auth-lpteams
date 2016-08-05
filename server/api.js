import { Router } from 'express';
import cpi from '../lib/cpi';
const router = Router();

router.get('/search/:series/:name/:arch', (req, res, next) => {
  let auth;
  if (req.app.locals.macaroonAuthHeader) {
    auth = req.app.locals.macaroonAuthHeader;
  }
  cpi.search(req.params.name, function(result) {
    req.body = result;
    next();
  }, {
    series: req.params.series,
    arch: req.params.arch,
    auth: auth
  });

}, function(req, res) {
  res.send(req.body);
});

// id exists outside a series
router.get('/details/:id/:series/:arch/:channel/:confinement', (req, res, next) => {
  let auth;
  if (req.session && req.session.macaroonAuthHeader) {
    auth = req.session.macaroonAuthHeader;
  }
  cpi.snap(req.params.id, function(result) {
    req.body = result;
    next();
  }, {
    series: req.params.series,
    arch: req.params.arch,
    auth: auth,
    channel: req.params.channel,
    confinement: req.params.confinement
  });

}, function(req, res) {
  res.send(req.body);
});

module.exports = router;
