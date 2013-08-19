var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "cc.hello.dyd@gmail.com",
       pass: "pass1word1"
   }
});
var mailOptions = {
   from: "cc.hello.dyd", // sender address
   to: "user@email.com", // list of receivers
   subject: "Test", // Subject line
   html: "<p>Some text</p>", // html body
   generateTextFromHTML: true,
}
smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
});