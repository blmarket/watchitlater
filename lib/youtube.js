var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var models = require('./models');

function Download(id, callback) {
  console.log("downloading " + id);
  var child = spawn(__dirname + '/../perl/download.pl', [ id ]);
  var filename = '';
  var err = '';
  child.stdin.end();
  child.stdout.on('data', function(chunk) {
    filename = filename + chunk.toString();
  });

  child.stderr.on('data', function(chunk) {
    err = err + chunk.toString();
  });

  child.stdout.on('end', function() {
    console.log(err);
    callback(null, filename);
  });
}

module.exports.download = Download;
//Download('joCj8322ovM');
