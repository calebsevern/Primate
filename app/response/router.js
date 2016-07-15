'use strict';
var router = require('express').Router();
var Response = require('./response-model');
var User = require('../user/user-model');

var postResponse = function(req, res) {
  Response.createResponse(req, function() {
    res.redirect(301, '/');
  });
};

var getResponses = function(req, res) {
  Response.getResponses(req.params.id, function(survey) {
    res.render('response/view', {survey: survey});
  });
};

router.post('/:id', postResponse);
router.get('/:id', User.isAuthenticated, getResponses);

module.exports = router;
