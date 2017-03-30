/**
 * Dependencies.
 */
var express = require('express');
var passport = require('passport');
var http = require('http');
var net = require("net");
var tls = require("tls");
var fs = require('fs');
var simpleParser = require('mailparser').simpleParser;
var router = express.Router();

var Message = require('../models/message');

var host = "outlook.office365.com";
var port = 995;

var Pop3 = function(){};

Pop3.sock;

var pop_email = '';
var pop_password = '';
var count = 0;
var body = "";

function onData(data) {
	if(data){
	    if(count < 4){
            data = data.toString("ascii");
            console.log("Received: " + data);
            var cmd = data.substr(0, 4).trim();
            console.log("cmd: "  + cmd);
            if(cmd == "+OK") {
                if(count == 0) {
                    Pop3.sock.write("USER " + pop_email+ "\r\n");
                    count++;
                } else if(count == 1) {
                    console.log("PASS **********");
                    Pop3.sock.write("PASS " + pop_password + "\r\n");
                    count++;
                } else if(count == 2) {
                    console.log("LIST");
                    Pop3.sock.write("LIST\r\n");
                    count++;
                } else if(count == 3) {
                    console.log("RETR");
                    Pop3.sock.write("RETR 2\r\n");
                    count++;
                }
            } else {
                console.log("Received unknown command: " + cmd);
			}
		} else {
	        body = data.toString("ascii");
	        simpleParser(body, (err, mail)=>{
	            if(mail.subject){
	            console.log(mail.subject);

//Form the message to be saved
				var message = new Message({
					subject: mail.subject,
					//content: mail.text,
					//creator: json_data.user_id,
					//html: mail.html,
					//raw_content: json_data.content, //raw data
					//mailbox: 'inbox',
					//date: mail.date,
					//pop3_id: json_data.id
				});

				//Save the message to the database
				message.save(function (err, message) {
				  if (err) {
				    console.log(err);
				  } else {
				  	    console.log("RETR SAVE SUCCESS!")
				  }
				});
				}
            });
		}
	} else {
		console.log("No data!");
	}
}

Pop3.prototype.connect = function(email, password){
    pop_email = email;
    pop_password = password;
	Pop3.sock = tls.connect({
			host: host,
			port: port,
			//rejectUnauthorized: !self.data.ignoretlserrs
		}, function() {

			if (Pop3.sock.authorized === false && self.data["ignoretlserrs"] === false) {
					self.emit("tls-error", socket.authorizationError);
					console.log("Error connecting to " + host + ":" + port);
			} else {
				console.log("Connected to " + host + ":" + port);
			}
		}
	);
	Pop3.sock.on('data', onData);
};

Pop3.prototype.login = function(email, password){
    while(ready == false){};
    Pop3.sock.write("USER " + email + "\r\n");
    ready = false;
    while(ready == false){};
    Pop3.sock.write("PASS " + password + "\r\n");
};

/*Pop3.socket.addListener('data', function(data) {
	// received data		
	console.log(data);
});
 
Pop3.socket.addListener('error', function(error) {
	if (!io.connected) {
		// socket was not connected, notify callback
		connected(null);
		}
	console.log("FAIL");
	console.log(error);
});
 
Pop3.socket.addListener('close', function() {
	// do something
	console.log("Conection closed");
});*/

module.exports = new Pop3();
