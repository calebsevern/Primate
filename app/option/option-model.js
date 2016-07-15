'use strict';
var config = require('../config');
var db = config.db.conn;
var Sequelize = require('sequelize');
var Answer = require('../answer/answer-model').Answer;

var Option = db.define('option', {
  value: {
    type: Sequelize.STRING,
    field: 'value'
  }
}, {
  freezeTableName: true
});
Option.hasMany(Answer);

function createOption(value, callback) {
  Option.sync().then(function() {
    return Option.create({
      value: value
    });
  }).then(function() {
    callback();
  });
}

exports.Option = Option;
exports.createOption = createOption;
