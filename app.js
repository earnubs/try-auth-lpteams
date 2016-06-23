"use strict";

const M = require('macaroons.js').MacaroonsBuilder;
const MacaroonsVerifier = require('macaroons.js').MacaroonsVerifier;
const MacaroonsConstants = require('macaroons.js').MacaroonsConstants;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const methodOverride = require('method-override');
const morgan = require('morgan');
const openid = require('openid');
const router = express.Router();
const ursa = require('ursa');
const request = require('superagent');

const Teams = require('./teams.js');
const Macaroons = require('./macaroons.js');

const key = fs.readFileSync('./sso_id_rsa.pub');
const sso = ursa.openSshPublicKey(new Buffer(key.toString('utf8').slice(8), 'base64'));

var MACAROON_SUGGESTED_SECRET_LENGTH = MacaroonsConstants.MACAROON_SUGGESTED_SECRET_LENGTH

openid['LaunchpadTeams'] = Teams;
openid['Macaroons'] = Macaroons;


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

/** Format a macaroon and it's associated discharge
 * @param {Object}
 * @return {String} A string suitable to use in an Authorization header.
**/
let _macaroon_auth = (macaroon, discharge) => {

  let macaroonObj = M.deserialize(macaroon);
  let dischargeObj = M.deserialize(discharge);

  let dischargeBound = M.modify(macaroonObj)
    .prepare_for_request(dischargeObj)
    .getMacaroon();

  let auth = `macaroon root="${macaroon}", discharge="${dischargeBound.serialize()}"`;

  return auth;
};

let extractCaveatId = (macaroon) => {
  let m = M.deserialize(macaroon);
  let caveatId;
  m.inspect();

  // if location is SSO, previous cid is the payload
  // https://github.com/nitram509/macaroons.js/blob/master/lib/MacaroonsDeSerializer.js#L50

  m.caveatPackets.some((packet, i) => {
    if (packet.valueAsText === 'login.staging.ubuntu.com') {
      return true;
    }
    if (packet.type === 3) {
      caveatId = packet.valueAsText;
    }
  });

  return caveatId;
};

let relyingParty;
let macaroon;

let _getSCAMacaroon = () => {
  request
    .post('https://myapps.developer.staging.ubuntu.com/dev/api/acl/')
    .type('json')
    .send({'permissions': ['package_access']})
    .end((err, res) => {
      macaroon = res.body.macaroon;
      let caveatId = extractCaveatId(macaroon);
      _setRelyingParty(caveatId);
    });
};

let _setRelyingParty = (caveatId) => {
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
};

_getSCAMacaroon();

let app = express();

app.set('view engine', 'ejs');
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

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/login/authenticate', (req, res) => {
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

app.post('/login/verify', (req, res) => {
  // Verify identity assertion
  // NOTE: Passing just the URL is also possible
  relyingParty.verifyAssertion(req, (error, result) => {
    if (!error && result.authenticated) {
      req.session.name = result.fullname;
      req.session.discharge = result.discharge;
      req.session.teams = result.teams;
    }
    //console.log(M.deserialize(req.session.discharge));
    _verifySCAMacaroon(req.session.discharge, macaroon);
    //getSCAMacaroon(req.session.discharge);
    res.redirect('/');
  });
});

app.use('/', router);

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('try-auth app listening at http://%s:%s', host, port);
});
