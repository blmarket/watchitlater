var client = require('./redis').client;
var redis = require('redis');

var hashid = 'scraper';

module.exports.rsslist = function RSSList(callback) {
  if(!callback) callback = redis.print;
  return client.lrange('rss', 0, -1, callback);
};

module.exports.addtorss = function AddToRSS(item, callback) {
  if(!callback) callback = redis.print;
  return client.lpush('rss', JSON.stringify(item), callback);
};

module.exports.resetrss = function ResetRSS(callback) {
  return client.del('rss', callback);
};

function set_hash(hash, key, value) {
  return client.hset(hash, key, value);
};

function get_hash(hash, key, callback) {
  client.hget(hash, key, callback);
};

module.exports.set_video = function(key, value) {
  set_hash(hashid, key, value);
}

module.exports.get_video = function(key, callback) {
  get_hash(hashid, key, callback);
}

