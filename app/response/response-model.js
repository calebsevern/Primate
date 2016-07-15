'use strict';
var config = require('../config');
var db = config.db.conn;
var Sequelize = require('sequelize');
var Survey = require('../survey/survey-model').Survey;
var Answer = require('../answer/answer-model').Answer;

var Response = db.define('response', {
  ip: {
    type: Sequelize.STRING,
    field: 'ip'
  }
}, {
  freezeTableName: true
});
Response.hasMany(Answer);
Response.belongsTo(Survey);

function createResponse(req, callback) {
  // Expected format of q-(answer ID) helps here
  var data = req.body;
  var answers = [];
  for (var key in data) {
    if (key.substr(0, 2) === 'q-') {
      answers.push({
        questionId: key.substr(2, key.length),
        optionId: data[key],
        surveyId: req.params.id
      });
    }
  }
  db.sync().then(function() {
    Response.create({
      ip: req.headers['x-forwarded-for'] || '',
      surveyId: req.params.id,
      answers: answers
    }, {
      include: [Answer, Survey]
    });
  }).then(function() {
    callback();
  });
}

function calcOptionStats(options, responses) {
  var totalAnswers = 0;
  for (var i = 0; i < options.length; i++) {
    for (var r = 0; r < responses.length; r++) {
      if (responses[r].optionId === options[i].id) {
        options[i].selected = responses[r].selected || 0;
        totalAnswers += responses[r].selected || 0;
      }
    }
    if (!options[i].selected) {
      options[i].selected = 0;
    }
  }

  // Calculate percentages out of totalAnswers
  for (i = 0; i < options.length; i++) {
    if (totalAnswers === 0) {
      options[i].percent = 0;
    } else {
      options[i].percent = Math.floor((options[i].selected / totalAnswers) * 100);
    }
  }

  // Add some pretty colors, too.
  var colors = ['#22A7F0', '#26A65B', '#1E824C', '#E87E04', '#446CB3', '#D24D57'];
  for (i = 0; i < options.length; i++) {
    options[i].color = colors[i % 6];
  }
  return options;
}

function getResponses(surveyId, callback) {
  require('../survey/survey-model').getSurvey(surveyId, function(survey) {
    var query = 'SELECT *, count(*) AS selected FROM answer ';
    query += 'LEFT JOIN question ON question.id=answer.questionId ';
    query += 'LEFT JOIN `option` ON `option`.id=answer.optionId ';
    query += 'WHERE answer.surveyId=? GROUP BY optionId';
    db.query(query, {
      replacements: [surveyId], 
      type: db.QueryTypes.SELECT
    }).then(function(results) {
      survey = JSON.parse(JSON.stringify(survey));
      var questions = survey.questions;
      for (var i = 0; i < questions.length; i++) {
        questions[i].options = calcOptionStats(questions[i].options, results);
      }
      callback(survey);
    });
  });
}

exports.Response = Response;
exports.createResponse = createResponse;
exports.getResponses = getResponses;
