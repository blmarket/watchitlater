var fs = require('fs');
var step = require('step');
var jsdom = require('jsdom');

var models = require('./models');

var fetch_naver = require('./naver_fetch').fetch_movieclip;
var fetch_youtube = require('./youtube').download;

var client = require('./redis').client;
var extract = require('./extract').extract;

/**
 * @param options {Object} video information {type:}, other elements are based on type
 * @param callback {Function} result callback, accepts (err, filename)
 */
function get_by_object(options, callback) {
  if(!options) return callback(new Error("null options"));

  switch(options.type) {
    case 'naver': {
      fetch_naver(options.category, options.id, callback);
      break;
    }
    case 'youtube': {
      fetch_youtube(options.id, callback);
      break;
    }
  }
};

function make_key(options) {
  switch(options.type) {
    case 'naver': 
      return 'naver:' + options.category + ':' + options.id
    case 'youtube':
      return 'youtube:' + options.id
  }
  return null;
}

function parse_ogp(window) {
  var ret = {};
  if(!window) return ret;
  var childs = window.document.getElementsByTagName('meta');
  var len = childs.length;

  var mapper = { 'og:title': 'title', 'og:description': 'desc' };
  for(var i=0;i<len;i++) {
    var c = childs[i];
    if(!c) continue;
    var prop = c.attributes['property'];
    if(!prop || !c.attributes['content']) continue;

    var dst = mapper[prop.nodeValue];
    if(!dst) continue;

    ret[dst] = c.attributes['content'].nodeValue;
  }
  console.log(ret);
  return ret;
}

function getiton(url) {
  var info = extract(url);
  step(function fetch() {
    get_by_object(info, this.parallel());
    jsdom.env({ html: url, done: this.parallel() });
  }, function parse(err, filename, window) {
    var ogData = parse_ogp(window);

    if(err) {
      console.log(err.stack);
      return;
    }

    if(!filename) {
      console.log("save failed : " + err);
      return;
    }

    var temp = require('temp');
    temp.dir = __dirname + '/../storage';
    var newfilename = temp.path({suffix: '.mp4'});

    fs.rename(filename, newfilename);

    models.addtorss(make_key(info), newfilename, new Date(), ogData.title, ogData.desc);
  });
}

module.exports.get_by_url = getiton;
module.exports.get_by_object = get_by_object;
module.exports.get = function(key, callback) {
  step(function check_redis() {
    models.get_video(key, this);
  }, function handle_redisresult(err, res) {
    if(err) throw err;
    if(res) {
      callback(null, res);
    } else {
      var tmp = key.split(':');
      var type = tmp[0];

      switch(type) {
        case 'naver': {
          var category = tmp[1];
          var id = tmp[2];
          fetch_movieclip(category, id, function(err, filename) {
            if(err) throw err;

            console.log("File written to " + filename);
            models.set_video(key, filename);
            callback(null, filename);
          });
          break;
        }
        case 'youtube': {
          var id = tmp[1];
          fetch_youtube(id, callback);
          break;
        }
      }
    }
  });
};
