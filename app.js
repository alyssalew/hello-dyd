var theLungStatusCode="";
var theMelanomaStatusCode="";
var theLungErrorMessage="";
var theMelanomaErrorMessage="";

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
  console.log("Hello, Lung Test!: " + res.statusCode);
  theLungStatusCode=res.statusCode;
}).on('error', function(e) {
  console.log("Error on Lung Test: " + e.message);
  theLungErrorMessage=e.message;
});

http.get(melanomatest, function(res) {
  console.log("Hello, Melanoma Test!: " + res.statusCode);
  theMelanomaStatusCode=res.statusCode;
}).on('error', function(e) {
  console.log("Error on Lung Test: " + e.message);
  theMelanomaErrorMessage=e.message;
});

app.get('/', function(req, res){
  res.send('<html> <head> <hl>Hello DYD?</hl> </head> <br> <body> <pre>Hello. Welcome to Hello DYD? This site will let you know whether the DYD services are availble.</pre> <br> The Lung Status Code is <b>'+ theLungStatusCode +' </b> <br> The Lung Error Message: <b>'+ theLungErrorMessage +' </b> <br><br>The Melanoma Status Code is <b> '+ theMelanomaStatusCode+' </b><br> The Melanoma Error Message: <b>'+ theMelanomaErrorMessage+'</b></body> </html>');
});

app.listen(3000);
console.log('Listening on port 3000');
