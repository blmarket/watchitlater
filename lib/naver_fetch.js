var urlparse = require('url');
var request = require('request');
var step = require('step');
var fs = require('fs');
var mkdirp = require('mkdirp');
var temp = require('temp');

var url = 'http://m.sports.naver.com/baseball/gamecenter/kbo/index.nhn?tab=vod&gameId=20120726WOHT0&vodId=28092';
var agent = 'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X; en-us) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B176 Safari/7534.48.3';

function fetch_movieclip(category, id, callback) {
  step(function fetch_url() {
    request({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': agent
      }
    }, this);
  }, function handle_response(err, res, body) {
    if(err) throw err;
    var obj = urlparse.parse(url);
    var vodurl = urlparse.format({
      protocol: 'http',
      host: obj.host,
      pathname: '/vod.nhn'
    });

    console.log("try fetching... " + vodurl);

    request({
      method: 'POST',
      url: vodurl,
      headers: {
        'User-Agent': agent,
        'Origin': 'http://m.sports.naver.com',
        'Host': 'm.sports.naver.com',
        'Referer': url
      },
      form: {
        id: id,
        category: category
      }
    }, this);
  }, function handle_vodresponse(err, res, body) {
    if(err) throw err;
    if(res.statusCode != 200) throw new Error("Invalid statusCode...");
    var haha = JSON.parse(body).url;

    var filename = temp.path({suffix: '.mp4'});
    var ost = fs.createWriteStream(filename);

    var req = request({
      method: 'GET',
      url: haha,
      headers: {
        'User-Agent': agent,
        'Origin': 'http://m.sports.naver.com',
        'Host': 'm.sports.naver.com',
        'Referer': url
      }
    });
    
    req.pipe(ost);
    req.on('end', function() {
      ost.end();
      callback(null, filename);
    });
  });
};

module.exports.fetch_movieclip = fetch_movieclip;
