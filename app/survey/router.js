'use strict';
var router = require('express').Router();
var config = require('../config');
var Survey = require('./survey-model');
var User = require('../user/user-model');

var postSurvey = function(req, res) {
  Survey.createSurvey(req.body, function(err) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.redirect(301, '/dashboard');
  });
};

var viewSurvey = function(req, res) {
  Survey.getSurvey(req.params.id, function(survey) {
    if (survey) {
      res.render('survey/view', {survey: survey});
    } else {
      res.redirect(301, '/');
    }
  });
};

var newSurvey = function(req, res) {
  res.render('survey/new');
};

router.post('/', postSurvey);
router.get('/new', User.isAuthenticated, newSurvey);
if (!config.hideSurveyURL) {
  router.get('/:id', viewSurvey);
}

module.exports = router;
