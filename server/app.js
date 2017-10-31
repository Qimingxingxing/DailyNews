var express = require('express');
var path = require('path');

var index = require('./routes/index');
var app = express();
var news = require("./routes/news");
// view engine setup
app.set('views', path.join(__dirname, '../client/dailynews/build/'));
app.set('view engine', 'jade');
app.use("/static", express.static(path.join(__dirname, "../client/dailynews/build/static/")));
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-with");
  next();
});
app.use('/', index);
app.use("/news", news);
// app.get("/secret", function (req, res, next) {
//   res.json({"secret":"Headers"});
// });
// app.use("/secret", function (req, res, next) {
//   console.log("hehe1");
//   next();
// });

// app.get("/secret", function (req, res, next) {
//   // res.json({"secret":"Headers"});
// });

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
