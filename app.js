var theLungStatusCode="";
var theMelanomaStatusCode="";
var theLungErrorMessage="";
var theMelanomaErrorMessage="";

var express = require('express');
var app = express();
var http = require("http");
var lungtest = {
  host: 'lungtest.dyd.cancercommons.org//',
  port: 80,
  path: '/index.html'
};

var melanomatest = {
  host: 'melanomatest.dyd.cancercommons.org//',
  port: 80,
  path: '/index.html'
};
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "cc.hello.dyd@gmail.com",
       pass: "pass1word1"
   }
});
var mailOptionsLungTest = {
   from: "cc.hello.dyd", // sender address
   to: "alyssalew2@gmail.com", // list of receivers
   subject: "Test-from lung", // Subject line
   html: "<p>Some text</p>", // html body
   generateTextFromHTML: true,
}
var mailOptionsMelanomaTest = {
   from: "cc.hello.dyd", // sender address
   to: "alyssalew2@gmail.com", // list of receivers
   subject: "Test-from Melanoma", // Subject line
   html: "<p>Some text</p>", // html body
   generateTextFromHTML: true,
}
http.get(lungtest, function(res) {
  console.log("Hello, Lung Test!: " + res.statusCode);
  theLungStatusCode=res.statusCode;
}).on('error', function(e) {
  console.log("Error on Lung Test: " + e.message);
  theLungErrorMessage=e.message;
  smtpTransport.sendMail(mailOptionsLungTest, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
  });
});

http.get(melanomatest, function(res) {
  console.log("Hello, Melanoma Test!: " + res.statusCode);
  theMelanomaStatusCode=res.statusCode;
}).on('error', function(e) {
  console.log("Error on Melanoma Test: " + e.message);
  theMelanomaErrorMessage=e.message;
  smtpTransport.sendMail(mailOptionsMelanomaTest, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
  });
});

app.get('/', function(req, res){
  res.send('<html> <head> <hl>Hello DYD?</hl> </head> <br> <body> <pre>Hello. Welcome to Hello DYD? This site will let you know whether the DYD services are availble.</pre> <br> The Lung Status Code is <b>'+ theLungStatusCode +' </b> <br> The Lung Error Message: <b>'+ theLungErrorMessage +' </b> <br><br>The Melanoma Status Code is <b> '+ theMelanomaStatusCode+' </b><br> The Melanoma Error Message: <b>'+ theMelanomaErrorMessage+'</b></body> </html>');
});

app.listen(3000);
console.log('Listening on port 3000');
