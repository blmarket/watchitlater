var request = require('request');

var url = 'http://localhost:3279/add';

request({
  method: 'POST',
  url: url,
  form: {
    category: 'kbo',
    id: '28178',
    title: '7월 27일 롯데vs두산',
    description: '하이라이트 : "이종욱 끝내기" 두산 역전승 2위 탈환'
  }
}, function(err, res, body) {
  console.log(body);
});
