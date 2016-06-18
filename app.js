var MacaroonsBuilder = require('macaroons.js').MacaroonsBuilder;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var methodOverride = require('method-override');
var morgan = require('morgan');
var openid = require('openid');
var router = express.Router();
var ursa = require('ursa');

var Teams = require('./teams.js');
var Macaroons = require('./macaroons.js');

openid['LaunchpadTeams'] = Teams;
openid['Macaroons'] = Macaroons;

var key = fs.readFileSync('./sso_rsa_id.pub');

var sso = ursa.openSshPublicKey(new Buffer(key.toString('utf8').slice(8), 'base64'));
//var sso = ursa.createPublicKey(fs.readFileSync('./sso.pem'));

/**
var _createBaseMacaroon = function() {
  var secret = new Buffer('39a630867921b61522892779c659934667606426402460f913c9171966e97775', 'hex');
  var location = 'http://localhost:3000';
  var macaroon = MacaroonsBuilder.create(location, secret, 'try-auth');

  var caveatKey = "4; guaranteed random by a fair toss of the dice";
  var payload = JSON.stringify({
    version: 1,
    secret: crt.encrypt(secret) 
  });

  macaroon = macaroon.add_third_party_caveat(
    'login.staging.ubuntu.com', caveat_key, payload
  ).getMacaroon();

  return macaroon;
};
**/

var relyingParty = new openid.RelyingParty(
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
      'caveat_id': JSON.stringify({
        'version': 1,
        'secret': new Buffer(sso.encrypt(crypto.randomBytes(32))).toString('base64')
      })
    })
    ]
); // List of extensions to enable and include

var app = express();

// configure Express
//app.set('views', path.join(__dirname, 'views'));
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

app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')); // handle error
  }
  next(); // otherwise continue
});

router.get('/', function(req, res){
  var name;
  if (req.session) {
    name = req.session.name;
  }
  res.render('index', { user: name });
});

router.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

router.get('/login/authenticate', function(request, response) {
  var identifier = 'https://login.staging.ubuntu.com/';

  // Resolve identifier, associate, and build authentication URL
  relyingParty.authenticate(identifier, false, function(error, authUrl) 	{
    if (error) {
      response.writeHead(200);
      response.end('Authentication failed: ' + error.message);
    }
    else if (!authUrl) {
      response.writeHead(200);
      response.end('Authentication failed');
    }
    else {
      response.writeHead(302, { Location: authUrl });
      response.end();
    }
  });
});

app.post('/login/verify', function(request, response) {

  // Verify identity assertion
  // NOTE: Passing just the URL is also possible
  relyingParty.verifyAssertion(request, function(error, result) {
    console.log(result);
    if (!error && result.authenticated) {
      request.session.name = result.fullname;
      request.session.discharge = result.discharge;
      request.session.teams = result.teams;
    }
    //console.log(result);
    response.redirect('/');
  });
});

app.use('/', router);

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('try-auth app listening at http://%s:%s', host, port);
});
