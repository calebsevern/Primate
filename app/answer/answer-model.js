'use strict';
var config = require('../config');
var db = config.db.conn;

var Answer = db.define('answer', {}, {
  freezeTableName: true
});

exports.Answer = Answer;
