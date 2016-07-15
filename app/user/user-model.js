'use strict';
var config = require('../config');
var secret = config.auth.secret;

function authenticate(req, callback) {
  var success = req.body.token === secret;
  req.session.token = success ? secret : null;
  callback(success);
}

function isAuthenticated(req, res, next) {
  if (req.session.token === secret)
    return next();
  res.redirect(301, '/auth/login');
}

exports.authenticate = authenticate;
exports.isAuthenticated = isAuthenticated;
