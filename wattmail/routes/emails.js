module.exports = function(io){
var express = require('express');
var passport = require('passport');
var http = require('http');
var net = require("net");
var pop3 = require('../lib/pop.js');

var router = express.Router();

var Message = require('../models/message');
var User = require('../models/user');


/* GET pop */
router.post('/sync',  ensureAuthenticated, function handler(req, res) {

	pop3.connect(req.user, req.body.password);	
    res.redirect('/email?sync=true');
});


router.get('/list', ensureAuthenticated, function handler(req, res) {
	User.getUserById(req.user.id, function(err, user) {
		console.log(user.inbox.length);
		res.render('list', {inbox: user.inbox});
	});
	/*Message.find(function(err, messages){
		console.log(messages.length);
		res.render('list', {inbox: messages});
	
	*/

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

	//var  sendMail = "["RCPT TO:<" + io["tmail"] + ">", "250"]"


	var top = "From: \"" + username + "\" <" + email + ">" + eol +
			"To: <" + io["tmail"] + ">" + eol +
			"CC: <" + io["cc"] + ">" + eol +
			"Subject: " + io["subject"] + eol;
	var cmd = [ ["", "220"],
			  ["HELO hw.ac.uk", "250"],
			  ["MAIL FROM:<" + email + ">", "250"] ];
			  
	
	
	var to_emails = io["tmail"].split(',');	
	var cc_emails = io["cc"].split(',');
	var bcc_emails = io["bcc"].split(',');

	if(to_emails.length > 0){
	var to_list = []
	for(i = 0; i < to_emails.length; i++){
		console.log(to_emails[i]);
		to_list.push(["RCPT TO:<" + to_emails[i] + ">", "250"]);
	}  
    cmd.push.apply(cmd, to_list);        
}
if(cc_emails.length > 0){
    var cc_list = []
	for(i = 0; i < cc_emails.length; i++){
		cc_list.push(["RCPT TO:<" + cc_emails[i] + ">", "250"]);
	}  
    cmd.push.apply(cmd, cc_list);     
    
}
    if(bcc_emails.length > 0){
    var bcc_list = []
	for(i = 0; i < bcc_emails.length; i++){
		bcc_list.push(["RCPT TO:<" + bcc_emails[i] + ">", "250"]);
	}  
    cmd.push.apply(cmd, bcc_list);     
  }
  
            
    var cmd_end = [["DATA", "354"],
              [top + eol + io["mail"] + eol + ".", "250"],
              ["QUIT", "221"] ];
              
    cmd.push.apply(cmd, cmd_end);     
    
  var client = net.connect(25, "mail-r.hw.ac.uk");

  client.on('data', function(data) {
    var msg = data.toString();
    var code = 0;
    if ( msg.length > 3 ) code = msg.substring(0, 3);
    page += msg;
    if ( n < cmd.length-2 && code == cmd[n][1] ) {
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

return router;
};

