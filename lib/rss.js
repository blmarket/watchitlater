var model = require('./models');
var jstoxml = require('jstoxml');

module.exports = function(callback) {
  model.rsslist(function(err, res) {
    if(err) callback(err);

    var ret = {
      _name: 'rss',
      _attrs: {
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        version: '2.0'
      },
      _content: {
        channel: [
          {title: 'my favourites'},
          {link: 'black market'},
          {description: "oh yes I don't know about copyrights"},
          {lastBuildDate: function() { return new Date(); }},
          {pubDate: function() { return new Date(); }},
          {language: 'ko_KR'},
          {
            _name: 'itunes:image',
            _attrs: {
              href: 'http://naver.com/favicon.ico'
            }
          }
        ]
      }
    };

    var target = ret._content.channel;
    (function() {
      if(!res) return;
      var length = res.length;
      for(var i=0;i<length;i++) {
        var obj = JSON.parse(res[i]);
        var tmp = obj.key.split(':');
        var category = tmp[0];
        var id = tmp[1];
        var type = obj.type || 'video/x-flv';
        target[target.length] = {
          item: [
            { title: obj.title },
            {
              _name: 'enclosure',
              _attrs: {
                url: 'http://192.168.0.4:3279/get/' + obj.key,
                type: type
              }
            },
            { description: obj.desc },
            { pubDate: function() {
              return new Date();
            }}
          ]
        }
      }
    })();

    callback(null, jstoxml.toXML(ret, {header: true, indent: '  '}));
  });
};

