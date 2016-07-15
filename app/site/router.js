'use strict';
var router = require('express').Router();
var config = require('../config');
var db = config.db.conn;
var User = require('../user/user-model');
var Survey = require('../survey/survey-model');

function getRandomSurvey(req, res) {
  var query = 'SELECT id FROM survey WHERE id NOT IN ';
  query += '(SELECT DISTINCT surveyId FROM response WHERE response.ip=?)';
  db.sync().then(function() {
    db.query(query, {
      replacements: [req.headers['x-forwarded-for'] || ''],
      type: db.QueryTypes.SELECT
    }).then(function(results) {
      if (results.length === 0) {
        res.render('site/ohno');
        return;
      }
      // Fetch and render survey
      var rand = Math.floor(Math.random() * results.length);
      var id = results[rand].id;
      if (config.hideSurveyURL) {
        Survey.getSurvey(id, function(survey) {
          res.render('survey/view', {survey: survey});
        });
      } else {
        res.redirect(301, '/survey/' + id);
      }
    });
  });
}

function getDashboard(req, res) {
  Survey.getSurveyList(function(surveys) {
    res.render('site/dashboard', {surveys: surveys});
  });
}

router.get('/', getRandomSurvey);
router.get('/dashboard', User.isAuthenticated, getDashboard);
module.exports = router;

