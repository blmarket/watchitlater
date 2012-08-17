var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var models = require('./models');

function Download(id, callback) {
  var child = spawn('../perl/download.pl', [ id ]);
  var filename = '';
  child.stdin.end();
  child.stdout.on('data', function(chunk) {
    filename = filename + chunk.toString();
  });

  child.stdout.on('end', function() {
    callback(null, filename);
  });
}

// Download('w5hgaNxzORs');

module.exports.download = Download;
