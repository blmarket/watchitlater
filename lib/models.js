var client = require('./redis').client;
var redis = require('redis');

var hashid = 'scraper';

function RSSList(callback) {
  if(!callback) callback = redis.print;
  return client.lrange('rss', 0, -1, callback);
};

function AddToRSS(key, filename, date, title, desc, callback) {
  if(!callback) callback = redis.print;

  var item = {
    key: key,
    date: date,
    title: title,
    desc: desc
  }
  return client.lpush('rss', JSON.stringify(item), function(err, value) {
    if(err) return callback(err);
    set_hash(hashid, key, filename);
  });
};

function ResetRSS(callback) {
  return client.del('rss', callback);
};

function set_hash(hash, key, value) {
  return client.hset(hash, key, value);
};

function get_hash(hash, key, callback) {
  client.hget(hash, key, callback);
};

module.exports.rsslist = RSSList;
module.exports.addtorss = AddToRSS;
module.exports.resetrss = ResetRSS;
module.exports.set_video = function(key, value) {
  set_hash(hashid, key, value);
}
module.exports.get_video = function(key, callback) {
  get_hash(hashid, key, callback);
}

