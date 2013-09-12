//These variables will be set every time the loop is run, so that we can show the latest run time
var hours,minutes,seconds,day,month,year,generatedTime;
var loopinterval = 600000; //microseconds: how often do we check the servers
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
var services = [ //defines the array 'services' as many arrays
  ['Lung Test','lungtest.dyd.cancercommons.org', 443, '/index.html'],
  ['Melanoma Test','melanomatest.dyd.cancercommons.org', 443,'/index.html'],
  ['Lung Live','lung.dyd.cancercommons.org', 443, '/index.html'],
  ['Melanoma Live','melanoma.dyd.cancercommons.org', 443 ,'/index.html']
  ['Lung Stage','lung-stage.dyd.cancercommons.org', 443 ,'/index.html']
  ['Melanoma Stage','melanoma-stage.dyd.cancercommons.org', 443 ,'/index.html']
];
var recipients= ['alyssalew2@gmail.com', ];//defines who will recive email alerts

var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "cc.hello.dyd@gmail.com",
       pass: "pass1word1"
   }
});

function addServiceText(theservice) //this specifies what service text should be included on the webpage
{
  theWebPage += "<br>";
  theWebPage += "The " + theservice[0] + " status code is <b><font color=#32CD32>" + theservice[4] + "</font></b>" ;
  theWebPage += "<br>";
  theWebPage += "The " + theservice[0] + " error message is <b><font color= #B22222>" + theservice[5] + "</font></b>" ;
  theWebPage += "<br>";
}
function addTimeStamp() //this defines what time text should included on the webpage
{
  theWebPage += "<br>";
  theWebPage += '<br> Last test done at: <i>' +  hours + ':' + minutes + ':' + seconds + ' on ' +  month + '/' + day + '/' + year + ' GMT </i>' ;
  rightNow = new Date().getTime();
  secondsAgo = (rightNow - generatedTime) / 1000;
  theWebPage += ' <b> which was ' + Math.round(secondsAgo) + ' seconds ago ';
  theWebPage += '</body> </html>';
}

app.get('/', function(req, res){ //shows on webpage: intro text, each service's text, timestamp
  theWebPage = "<html><hl><b>Hello DYD?</b></hl><br> <body><tt>Hello. Welcome to Hello DYD? This site will let you know whether the DYD services are availble.</tt><br>";
  services.forEach(addServiceText);
  addTimeStamp();
  res.send(theWebPage);
});

app.listen(3000);
console.log('Listening on port 3000');

//loop starts here: it gets run every 60 seconds
function log(theservice)
{
  console.log("Hello, " + theservice[0] + "!"); //prints the service name to the console
}

function tickle(theservice) //when a service is down: sends email, send error code to console
{
  params = { host: theservice[1], 
             port: theservice[2],
 	     path: theservice[3]
           };
  var mailOptions = {
    from: "Hello DYD!", // sender address
    to: recipients, // list of receivers
    subject: "Alert from " + theservice[0], // Subject line
    html: "<p>The service <b>" + theservice[0] + "</b> might be down! Oh no!", // html body
    generateTextFromHTML: true,
  }
 
  https.get(params, function(res) {
   theservice[4]=res.statusCode;
 }).on('error', function(e) {
     console.log("Error on  " + theservice[0] + ": " +  e.message);
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
function setTime() //gets the current date and time 
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
 if (hours < 10)
 {
   hours= '0' + hours;
 }
 seconds = currentTime.getSeconds();
 generatedTime = currentTime.getTime();
}

function checkHosts() //checks all the services
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


