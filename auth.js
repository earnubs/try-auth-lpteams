'use strict';
import { MacaroonsBuilder } from 'macaroons.js';
import { Router } from 'express';
import openid from 'openid';
import request from 'superagent';

import Teams from './teams';
import Macaroons from './macaroons.js';

const router = Router();

const SSO_HOST = 'login.staging.ubuntu.com';
const SSO_URL = `https://${SSO_HOST}`;
const MYAPPS_URL = 'https://myapps.developer.staging.ubuntu.com';

openid['LaunchpadTeams'] = Teams;
openid['Macaroons'] = Macaroons;

/** Format a macaroon and it's associated discharge
 * @param {Object}
 * @return {String} A string suitable to use in an Authorization header.
**/
const _macaroon_auth = (macaroon, discharge) => {

  let macaroonObj = MacaroonsBuilder.deserialize(macaroon);
  let dischargeObj = MacaroonsBuilder.deserialize(discharge);

  let dischargeBound = MacaroonsBuilder.modify(macaroonObj)
    .prepare_for_request(dischargeObj)
    .getMacaroon();

  let auth = `macaroon root="${macaroon}", discharge="${dischargeBound.serialize()}"`;

  return auth;
};

/** Extract the login.ubuntu.com cid
 * @param {String} macaroon serialized macaroon
 * @return {String} login.ubuntu.com cid
**/
const extractCaveatId = (macaroon) => {
  let m = MacaroonsBuilder.deserialize(macaroon);
  let ssocid;
  m.inspect();

  m.caveatPackets.some((packet) => {
    if (packet.valueAsText === SSO_HOST) {
      return true;
    }
    if (packet.type === 3) {
      ssocid = packet.valueAsText;
    }
  });

  return ssocid;
};

let macaroon; // not sure yet where to put this?
let relyingParty; // or this

/**
 * @return {Function} superagent request
 * @param {Array} permissions
 */
const requestSCAMacaroon = (req, res, next) => {
  request
    .post(`${MYAPPS_URL}/dev/api/acl/`)
    .type('json')
    .send({'permissions': ['package_access']})
    .end((err, res) => {

      if (err) {
        next(new Error(err));
      }

      req.caveatId = extractCaveatId(res.body.macaroon);
      macaroon = res.body.macaroon;
      next();
    });
};

const createRelyingParty = (req, res, next) => {
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
      'caveat_id': req.caveatId
    })
    ]
  );

  next();
};

let _verifySCAMacaroon = (discharge, root) => {
  let auth = _macaroon_auth(root, discharge);

  request
    .post(`${MYAPPS_URL}/dev/api/acl/verify/`)
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
      }
      console.log('verify response:', res.body);
    });
};

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/authenticate', requestSCAMacaroon, createRelyingParty, (req, res) => {
  let identifier = SSO_URL;

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
    /**
     * macaroon is what we got back from SCA
     */
    _verifySCAMacaroon(req.session.discharge, macaroon);

    res.redirect('/');
  });
});

module.exports = router;
