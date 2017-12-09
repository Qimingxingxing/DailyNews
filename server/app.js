var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require("cors");
var passport = require('passport');
var index = require('./routes/index');
var news = require("./routes/news");
var auth = require('./routes/auth');

var mongoose = require('mongoose');
var app = express();

mongoose.connect("mongodb://0.0.0.0/test");
require('./models/user');
app.use(passport.initialize());
var localSignupStrategy = require('./passport/signup_passport');
var localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(cors())
app.use('/static', express.static(path.join(__dirname, '../client/dailynews/build/static/')));
app.use('/', index);
app.use("/news", news);
app.use("/auth", auth)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
