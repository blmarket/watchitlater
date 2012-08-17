var redis = require('redis');

var client = redis.createClient();

client.on('error', function(err) {
  throw err;
});

process.on('exit', function() {
  client.quit();
});

module.exports.client = client;
