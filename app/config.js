var config = module.exports;

config.express = {
  port: process.env.PORT || 3333,
  ip: '0.0.0.0'
};

config.hideSurveyURL = true;

config.db = {
  host: 'localhost',
  dialect: 'mysql',
  database: 'primate_poll',
  username: '',
  password: '',
  conn: null
};

config.auth = {
  secret: process.env.AUTH_SECRET || 'turtleturtle'
};
