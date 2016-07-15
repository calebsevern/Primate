'use strict';
var config = require('./config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('primate_poll', config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

config.db.conn = sequelize;

sequelize.authenticate().then(function(err) {
  console.log(err || 'Connected to MySQL database');
}).catch(function (err) {
  console.log('Database connection error:', err);
});

