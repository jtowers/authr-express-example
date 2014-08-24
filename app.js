// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');

// Uses passport to authenticate requests
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

// Create a new instance of authr with the default configuration
var Authr = require('authr');
var authr = new Authr();

// setup views for express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// More app configuration
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: '3c0b09fc471cef781c7f5e5b22f9464',
    cookie: {
        maxAge: 20 * 60 * 1000
    },
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Serilize the user passed to passport
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// Deserialize user for passport
passport.deserializeUser(function (id, done) {
    // Run a query using the database adapter that authr is using
    authr.config.Adapter.db.findOne({_id:id}, function (err, user) {
        if (err) {
            done(err);
        }
        console.log(user);
        done(null, user);
    });
});


// Check to see if there is a user in session
function loggedIn(req, res, next) {
    console.log(req.user);
    if (req.user) {
        if (req.method === 'HEAD' || req.method === 'OPTIONS') {
            next();
        } else {
            req.session._garbage = Date();
            req.session.touch();
            next();
        }

    } else {
        status = {
            status: 'Unauthenticated'
        };
        res.json(401, req.session);
    }
}

app.get('/', function(req, res){
  res.render('index');
});

app.get('/sessionExists', loggedIn, function(req, res){
    res.status(200).json(req.user);
});

app.post('/signup', function(req, res){
  var body = req.body;
  var signup = {
    username: body.username,
    password: body.password
  };
    console.log(signup);
  authr.signUp(signup, function(err, user){
      console.log('authr signup');
  if(err){
    console.log('error: ' + err);
      res.status(400).json(err);
  } else {
    res.status(200).json(user);
      console.log('user: '+ user); // returns the user inserted into nedb.
  }
});
});

app.post('/verifyToken', function(req, res){
  var token = req.body.token;
  authr.verifyEmail(token, function(err, user){
      if(err){
          res.status(400).json(err);
      } else {
          res.status(200).json(user);
      }
  });
});

app.post('/login', function(req, res){
  var login = {
    username: req.body.username,
    password: req.body.password
  };

  authr.login(login, function(err, user){
    if(err){
        res.status(400).json(err);
    } else {
        // Give the user to Passport for session management and return the user to the browser
        // See app.js for the Passport config
        req.login(user, function(err){
           if(err){
               res.status(400).json(err);
           } else {
               res.status(200).json(req.user);
           }
        });
    }

  });
});

app.post('/createResetToken', function(req, res){
   authr.createPasswordResetToken(req.body.username, function(err, user){
       if(err){
           res.status(400).json(err);
       } else {
           res.status(200).json(user);
       }
   }) ;
});

app.get('/verifyToken/:token', function(req, res){
    authr.verifyPasswordResetToken(req.params.token, function(err, user){
        if(err){
            res.status(400).json(err);
        } else {
            res.status(200).json(user);
        }
    });
});

app.post('/verifyToken/:token', function(req, res){
   authr.updatePassword(req.params.token, req.body.email, function(err, user){
      if(err){
          res.status(400).json(err);
      } else {
          res.status(200).json(user);
      }
   });
});

app.post('/delete', function(req, res){
    var body = req.body;
    login = {
        username: req.body.username,
        password: req.body.password
    };
    authr.deleteAccount(login, function(err, user){
       if(err){
           res.status(400).json(err);
       } else {
           res.status(200).json(user);
       }
    });
});

// SERVER
// ------
var server = app.listen(8888, function () {
    console.log('Listening on port %d', server.address()
        .port);
});
