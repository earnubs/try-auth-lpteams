"use strict";
const MacaroonsBuilder = require('macaroons.js').MacaroonsBuilder;
const MacaroonsConstants = require('macaroons.js').MacaroonsConstants;
const MacaroonsVerifier = require('macaroons.js').MacaroonsVerifier;
const express = require('express');
const openid = require('openid');
const request = require('superagent');
const router = express.Router();

const Teams = require('./teams.js');
const Macaroons = require('./macaroons.js');

openid['LaunchpadTeams'] = Teams;
openid['Macaroons'] = Macaroons;

let relyingParty;

/** Format a macaroon and it's associated discharge
 * @param {Object}
 * @return {String} A string suitable to use in an Authorization header.
**/
let _macaroon_auth = (macaroon, discharge) => {

  let macaroonObj = MacaroonsBuilder.deserialize(macaroon);
  let dischargeObj = MacaroonsBuilder.deserialize(discharge);

  letddischargeBound = MacaroonsBuilder.modify(macaroonObj)
    .prepare_for_request(dischargeObj)
    .getMacaroon();

  let auth = `macaroon root="${macaroon}", discharge="${dischargeBound.serialize()}"`;

  return auth;
};

/** Extract the login.ubuntu.com cid
 * @param {String} macaroon serialized macaroon
 * @return {String} login.ubuntu.com cid
**/
let extractCaveatId = (macaroon) => {
  let m = MacaroonsBuilder.deserialize(macaroon);
  let ssocid;
  m.inspect();

  m.caveatPackets.some((packet, i) => {
    if (packet.valueAsText === 'login.staging.ubuntu.com') {
      return true;
    }
    if (packet.type === 3) { // FIXME use constant
      ssocid = packet.valueAsText;
    }
  });

  return ssocid;
};

/**
 * @return {Function} superagent request
 * @param {Array} permissions
 */
let _getSCAMacaroon = (req, res, next) => {
  request
    .post('https://myapps.developer.staging.ubuntu.com/dev/api/acl/')
    .type('json')
    .send({'permissions': ['package_access']})
    .end((err, res) => {

      if (err) {
        next(new Error(err));
      }

      let caveatId = extractCaveatId(res.body.macaroon);

      _setRelyingParty(caveatId, next);
    });
};

let _setRelyingParty = (caveatId, next) => {
  relyingParty = new openid.RelyingParty(
    'http://localhost:3000/login/verify', // Verification URL (yours)
    'http://localhost:3000', // Realm (optional, specifies realm for OpenID authentication)
    false, // Use stateless verification
    false, // Strict mode
    [new openid.SimpleRegistration({
      'nickname' : true,
      'email' : true,
      'fullname' : true,
      'language' : true
    }),
    new openid.LaunchpadTeams({
      'teams': [
        'ubuntuone-hackers'
      ]
    }),
    new openid.Macaroons({
      'caveat_id': caveatId
    })
    ]
  );

  next();
};

let _verifySCAMacaroon = (discharge, root) => {
  let auth = _macaroon_auth(root, discharge);

  request
    .post('https://myapps.developer.staging.ubuntu.com/dev/api/acl/verify/')
    .send({
      'auth_data': {
        'http_uri': 'http://localhost:3000',
        'http_method': 'POST',
        'authorization': auth
      }
    })
    .end((err,res) => {
      if (err) {
        console.log('error:', err);
      };
      console.log('verify response:', res.body);
    })
};

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/authenticate', _getSCAMacaroon, (req, res) => {
  let identifier = 'https://login.staging.ubuntu.com/';

  // Resolve identifier, associate, and build authentication URL
  relyingParty.authenticate(identifier, false, (error, authUrl) => {
    if (error) {
      res.writeHead(200);
      res.end('Authentication failed: ' + error.message);
    }
    else if (!authUrl) {
      res.writeHead(200);
      res.end('Authentication failed');
    }
    else {
      res.writeHead(302, { Location: authUrl });
      res.end();
    }
  });
});

router.post('/verify', (req, res) => {
  relyingParty.verifyAssertion(req, (error, result) => {
    if (!error && result.authenticated) {
      req.session.name = result.fullname;
      req.session.discharge = result.discharge;
      req.session.teams = result.teams;
    }
    res.redirect('/');
  });
});

module.exports = router;
