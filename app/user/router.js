'use strict';
var router = require('express').Router();
var User = require('./user-model');

var getLogin = function(req, res) {
  res.render('user/login');
};

var postLogin = function(req, res) {
  User.authenticate(req, function() {
    res.redirect(301, '/dashboard');
  });
};

var getLogout = function(req, res) {
  req.session.destroy(function() {
    res.redirect(301, '/auth/login');
  });
};

router.post('/login', postLogin);
router.get('/login', getLogin);
router.get('/logout', getLogout);

module.exports = router;
