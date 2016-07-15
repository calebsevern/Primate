var express = require('express');
var path = require('path');
var app = express();
var config = require('./config');
require('./db');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var session = require('express-session');
app.use(session({
  secret: '!f-tB!RD4xPx2$$3Jxu!aFLzv6C6-b%b',
  cookie: {
    secure: false 
  },
  saveUninitialized: false,
  resave: false
}));

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.locals.authenticated = req.session.token === config.auth.secret
  next()
});

// app.use('/question', require('./question/router'));
app.use('/response', require('./response/router'));
app.use('/survey', require('./survey/router'));
app.use('/auth', require('./user/router'));
app.use('/', require('./site/router'));

module.exports = app;
