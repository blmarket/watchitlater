var fetch = require('./lib/cache_fetcher').get;
var rss = require('./lib/rss');
var models = require('./lib/models');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express.createServer();

app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + "/storage"));

app.get('/rss', function(req, res, next) {
  rss(function(err, result) {
    console.log(result);
    res.header('Content-Type', 'application/rss+xml');
    res.end(result);
  });
});

app.get('/add/youtube', function(req, res, next) {
  res.render('add_youtube');
});

app.post('/add/youtube', function(req, res, next) {
  if(!req.body) return next(404);
  var id = req.body.id;
  if(!id) return next(404);

  var key = "youtube:" + id;
  fetch(key, function(err, filename) {
    res.send('done');
  });
});

app.post('/add', function(req, res, next) {
  if(!req.body) return next(404);
  var id = req.body.id;
  var category = req.body.category;

  if(!id || !category) return next(404);

  var key = "naver:" + category + ":" + id;
  var date = new Date();
  var title = req.body.title || "No Title";
  var description = req.body.description || "No Description";

  fetch(key, function(err, filename) {
    if(err) return next(err);
    models.addtorss({
      key: key,
      date: date,
      title: title,
      desc: description
    }, function(err, value) {
      if(err) return next(err);
      res.end('done');
    });
  });
});

app.get('/get/:key', function(req, res, next) {
  var key = req.param('key', null);
  if(!key) return next(new Error('Invalid arguments'));
  fetch(key, function(err, filename) {
    if(err) return next(err);
    console.log("sending " + filename);
    res.download(filename, path.basename(filename));
    //res.sendfile(filename);
    //res.redirect(path.basename(filename)); // dirty...
  });
});

app.listen(3279);
console.log("Listening 3279");

//
// client.lpush('rss', 'kbo:28179');
//process.exit(0); // explicit exit due to redis client

