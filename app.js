var path = require('path');
var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session')
var RedisStore = require('connect-redis')(session);
var openid = require('openid');
var util = require('util');
var Teams = require('./teams.js');

openid['LaunchpadTeams'] = Teams;

var relyingParty = new openid.RelyingParty(
    'http://localhost:3000/login/verify', // Verification URL (yours)
    'http://localhost:3000', // Realm (optional, specifies realm for OpenID authentication)
    false, // Use stateless verification
    false, // Strict mode
    [new openid.SimpleRegistration(
        {
          "nickname" : true,
          "email" : true,
          "fullname" : true,
          "language" : true,
        }),
    new openid.LaunchpadTeams({
      'teams': [
        'ubuntuone-hackers'
        ]
    })]
); // List of extensions to enable and include

var app = express();

// configure Express
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
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
    return next(new Error('oh no')) // handle error
  }
  next() // otherwise continue
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

app.get('/login/verify', function(request, response) {
  console.log(request);
  // Verify identity assertion
  // NOTE: Passing just the URL is also possible
  relyingParty.verifyAssertion(request, function(error, result) {
    if (!error && result.authenticated) {
      request.session.name = result.fullname;
    }
    console.log(result);
    response.redirect('/');

  });
});

app.use('/', router);

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('try-auth app listening at http://%s:%s', host, port);
});
