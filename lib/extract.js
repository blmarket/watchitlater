var urlparse = require('url');
var querystring = require('querystring');

function Dialect_naver(url) {
  var naver_london = /sports.news.naver.com\/([^\/]*)\/video.nhn\?(.*)$/;

  var match = url.match(naver_london);
  if(match) {
    var naver_options = {
      type: 'naver',
      category: match[1],
      id: querystring.parse(match[2]).id
    }
    return naver_options;
  }

  var naver_videoCenter = /sports.news.naver.com\/videoCenter/;
  if(url.match(naver_videoCenter)) {
    var query = querystring.parse(urlparse.parse(url).query);
    if(query.id && query.category) {
      return {
        type: 'naver',
        category: query.category,
        id: query.id
      }
    }
  }

  return null;
}

function Dialect_youtube(url) {
  var match = url.match(/(youtube.com|youtu.be)\/watch\?(.*)$/);
  if(!match) return null;

  return {
    type: 'youtube',
    id: querystring.parse(match[2]).v
  }
}

function justyoutube(url) {
  return {
    type: 'youtube',
    id: url
  }
};

function cocktail(url) {
  var dialects = [ Dialect_naver, Dialect_youtube ];
  var len = dialects.length;
  for(var i=0;i<len;i++) {
    var res = dialects[i](url);
    if(res) return res;
  }
  return null;
}

module.exports.extract = cocktail;
