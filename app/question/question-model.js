'use strict';
var config = require('../config');
var db = config.db.conn;
var Sequelize = require('sequelize');
var Option = require('../option/option-model').Option;
var Answer = require('../answer/answer-model').Answer;

var Question = db.define('question', {
  title: {
    type: Sequelize.STRING,
    field: 'text'
  },
  number: {
    type: Sequelize.INTEGER,
    field: 'number'
  }
}, {
  freezeTableName: true
});
Question.hasMany(Option);
Question.hasMany(Answer);

exports.Question = Question;
