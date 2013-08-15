var express = require('express');
var app = express();
var http = require("http");
var lungtest = {
  host: 'lungtest.dyd.cancercommons.org',
  port: 80,
  path: '/index.html'
};

var melanomatest = {
  host: 'melanomatest.dyd.cancercommons.org',
  port: 80,
  path: '/index.html'
};

http.get(lungtest, function(res) {
  console.log("Yes, Lung Test!: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

http.get(melanomatest, function(res) {
  console.log("Yes, Melanoma Test!: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

app.get('/', function(req, res){
  res.send('Hello DYD?');
});
app.listen(3000);
console.log('Listening on port 3000');