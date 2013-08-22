//These variables will be set every time the loop is run, so that we can show the latest run time
var hours,minutes,seconds,day,month,year;
var loopinterval = 60000; //microseconds: how often do we check the servers
var express = require('express');
var app = express();
var http = require("http");
var https = require("https");
var theWebPage="";
//service:
//[0]: friendly name
//[1]: URL
//[2]: port
//[3]: path
//[4]: HTTP status code
//[5]: Error message
var services = [
  ['Lung Test','lungtest.dyd.cancercommons.org', 443, '/index.html'],
  ['Melanoma Test','melanomatest.dyd.cancercommons.org', 443,'/index.html'],
  ['Lung Live','lung.dyd.cancercommons.org', 443, '/index.html'],
  ['Melanoma Live','melanoma.dyd.cancercommons.org', 443 ,'/index.html']
];
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "cc.hello.dyd@gmail.com",
       pass: "pass1word1"
   }
});

function addServiceText(theservice)
{
  theWebPage += "<br>";
  theWebPage += "The " + theservice[0] + " status code is <b>" + theservice[4] + "</b>" ;
  theWebPage += "<br>";
  theWebPage += "The " + theservice[0] + " error message is " + theservice[5] ;
  theWebPage += "<br>";
}
function addTimeStamp()
{
  theWebPage += "<br>";
  theWebPage += '<br> Last test done at : ' +  hours + ':' + minutes + ':' + seconds + ' on ' +  month + '/' + day + '/' + year + '</body> </html>'
}

app.get('/', function(req, res){
  theWebPage = "<html> <head> <hl>Hello DYD?</hl> </head><br> <body> <pre>Hello. Welcome to Hello DYD? This site will let you know whether the DYD services are availble.</pre> <br>";
  services.forEach(addServiceText);
  addTimeStamp();
  res.send(theWebPage);
});

app.listen(3000);
console.log('Listening on port 3000');

//loop starts here: it gets run every 60 seconds
function log(theservice)
{
  console.log("Hello, " + theservice[0] + "!");
}

function tickle(theservice)
{
  params = { host: theservice[1], 
             port: theservice[2],
 	     path: theservice[3]
           };
  var mailOptions = {
    from: "Hello DYD!", // sender address
    to: "alyssalew2@gmail.com", // list of receivers
    subject: "Alert from " + theservice[0], // Subject line
    html: "<p>Service " + theservice[0] + " might be down! Oh no!", // html body
    generateTextFromHTML: true,
  }
 
  https.get(params, function(res) {
   theservice[4]=res.statusCode;
 }).on('error', function(e) {
     console.log("Error on  " + theservice[0] + ":" +  e.message);
     theservice[4]=e.message;
     smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }
   });
 });
}
function setTime()
{
 var currentTime = new Date();
 month = currentTime.getMonth() + 1;
 day = currentTime.getDate();
 year = currentTime.getFullYear();
 hours = currentTime.getHours();
 minutes = currentTime.getMinutes();
 if (minutes < 10)
 {
   minutes = '0' + minutes;
 }
 seconds = currentTime.getSeconds();
}

function checkHosts()
{
 console.log('Entered CheckHosts');
 setTime();
 services.forEach(log);
 services.forEach(tickle);

 //Will queue the next call to checkHosts 60 seconds from now
 setTimeout((function() {
    checkHosts();
 }), loopinterval); //setTimeOut
} //loop ends here
 

//Call to begin looping after one second
setTimeout((function() {
  checkHosts();
}), 1000); //setTimeOut


