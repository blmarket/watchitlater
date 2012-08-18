var fetch = require('./lib/cache_fetcher').get;
var rss = require('./lib/rss');
var models = require('./lib/models');
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

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

