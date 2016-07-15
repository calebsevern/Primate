'use strict';
var config = require('../config');
var db = config.db.conn;
var Sequelize = require('sequelize');
var Question = require('../question/question-model').Question;
var Option = require('../option/option-model').Option;
var Answer = require('../answer/answer-model').Answer;

var Survey = db.define('survey', {
  title: {
    type: Sequelize.STRING,
    field: 'title'
  }
}, {
  freezeTableName: true
});
Survey.hasMany(Question);
Survey.hasMany(Answer);

/**
* Saves an arbitrary number of Questions,
* their answer options,
* and basic survey data
*/
function createSurvey(data, callback) {
  data = JSON.parse(data.json);
  var questions = [];
  for (var i = 0; i < data.questions.length; i++) {
    questions.push({
      title: data.questions[i].title,
      number: i,
      options: data.questions[i].options
    });
  }

  db.sync().then(function() {
    Survey.create({
      title: data.title,
      questions: questions
    }, {
      include: [{
        model: Question,
        include: [Option]
      }, Answer]
    });
  }).then(function() {
    callback();
  });
}

function getSurvey(id, callback) {
  db.sync().then(function() {
    return Survey.findById(id, {
      include: [{
        model: Question,
        include: [Option]
      }]
    });
  }).then(function(survey) {
    if (!survey) {
      callback();
      return;
    }
    callback(survey.dataValues);
  });
}

function getSurveyList(callback) {
  var query = 'SELECT * FROM survey LEFT JOIN (SELECT surveyId, count(surveyId) ';
  query += 'AS responses FROM response GROUP BY surveyId) AS r ON survey.id=r.surveyId';
  db.sync().then(function() {
    db.query(query, {
      type: db.QueryTypes.SELECT
    }).then(function(results) {
      callback(results);
    });
  });
}

exports.Survey = Survey;
exports.createSurvey = createSurvey;
exports.getSurvey = getSurvey;
exports.getSurveyList = getSurveyList;
