var express = require('express');
var passport = require('passport');
var http = require('http');
var net = require("net");

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res){
	res.render('overview');
});

/* GET Email page. */
router.get('/email',  ensureAuthenticated, function(req, res){
	var username = req.user.username;
	var email = req.user.email;
	res.render('index', {username:username, email:email});
});

/* GET smtp */
router.get('/smtp',  ensureAuthenticated, function handler(req, res) {
  var head = "<!DOCTYPE html>\n<html>\n<head>\n" +
             "<title>Post</title>\n</head>\n<body>\n<p>\n";
  var tail = "</p>\n</body>\n</html>\n";
  if ( req.ip.indexOf("137.195.") == -1 ) {
    try { res.send(head + "outside hw.ac.uk" + tail); } catch (exc) {};
    return;
  }

  var page = "";
  var n = 0;
  var io = req.query;
  var eol = "\r\n";

  var username = req.user.username;
  var email = req.user.email;
  
  var top = "From: \"" + username + "\" <" + email + ">" + eol +
            "To: <" + io["tmail"] + ">" + eol +
            "CC: <" + io["cc"] + ">" + eol +
            "Subject: " + io["subject"] + eol;
  var cmd = [ ["", "220"],
              ["HELO hw.ac.uk", "250"],
              ["MAIL FROM:<" + email + ">", "250"],
              ["RCPT TO:<" + io["tmail"] + ">", "250"],
              ["RCPT TO:<" + io["cc"] + ">", "250"],
              ["RCPT TO:<" + io["bcc"] + ">", "250"],
              ["DATA", "354"],
              [top + eol + io["mail"] + eol + ".", "250"],
              ["QUIT", "221"] ];
  var client = net.connect(25, "mail-r.hw.ac.uk");

  client.on('data', function(data) {
    var msg = data.toString();
    var code = 0;
    if ( msg.length > 3 ) code = msg.substring(0, 3);
    page += msg;
    if ( n < 8 && code == cmd[n][1] ) {
      n++;
      page += "<b>" + cmd[n][0].replace(/</g, "&lt;") + "</b>" + eol;
      client.write(cmd[n][0] + eol);
    } else {
      page = page.replace(/\r\n/g, "<br/>\r\n");
      try { res.send(head + page + tail); } catch (exc) {}
      client.end();
    }
  });
});

/* Log in authentication */
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;

