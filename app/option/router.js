'use strict';
var router = require('express').Router();
var Option = require('./option-model');

var createOption = function(req, res) {
  Option.createQuestion(function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(user);
  });
};

router.post('/', createOption);

module.exports = router;
