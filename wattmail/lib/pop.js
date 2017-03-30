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
var User = require('../models/user');

var host = "outlook.office365.com";
var port = 995;

var Pop3 = function(){};

Pop3.sock;


var count = 0;
var packet;
var pop = {
    email: '',
    password: ''
};
var email = {
    to_emails: [],
    cc_emails: [],
    bcc_emails: [],
    from_emails: []
};

function decodeData(data){
    simpleParser(data, (err, mail)=>{
        if(mail.to){
            for(msg in mail.to.value){
            email.to_emails.push(mail.to.value[msg].address);
            }
        }
        if(mail.cc){
            for(msg in mail.cc.value){
            email.cc_emails.push(mail.cc.value[msg].address);
            }
        }
        if(mail.bcc){
            for(msg in mail.bcc.value){
            email.bcc_emails.push(mail.bcc.value[msg].address);
            }
        }
        if(mail.from){
            for(msg in mail.from.value){
            email.from_emails.push(mail.from.value[msg].address);
            }
        }
        if(mail.subject){
            email.subject = mail.subject;
        }
        var message = new Message({
            to_emails: email.to_emails,
            cc_emails: email.cc_emails,
            bcc_emails: email.bcc_emails,
            from_emails: email.from_emails,
            subject: email.subject,
            //content: mail.text,
            creator: email.creator
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
            User.findByIdAndUpdate(
                email.creator,
                { $push: {"inbox": message.id}},
                {safe: true, upsert: true, new: true},
                function(err, model) {
                    if (err){
                        console.log("ERROR: " + err);
                    } else {
                        console.log("RETR SAVE SUCCESS!")
                    }
                }
                );
            }
          });
    });
};

function onData(data) {
	if(data){
	    data = data.toString("ascii");
	    if(count < 4){
            var cmd = data.substr(0, 4).trim();
            // console.log("cmd: "  + cmd);
            if(cmd == "+OK") {
                if(count == 0) {
                    Pop3.sock.write("USER " + pop.email+ "\r\n");
                    count++;
                } else if(count == 1) {
                    Pop3.sock.write("PASS " + pop.password + "\r\n");
                    count++;
                } else if(count == 2) {
                    Pop3.sock.write("LIST\r\n");
                    count++;
                } else if(count == 3) {
                    Pop3.sock.write("RETR 2\r\n");
                    count++;
                }
            } else {
                console.log("Received unknown command: " + cmd);
			}
		} else if(data.substring(data.length - 3, data.length) == ".\r\n"){
		    console.log("SAVE");
            //Form the message to be saved
            packet += data;
            decodeData(packet);
        } else {
            console.log("Data Packet Recieved");
		    packet += data;
		}
	} else {
		console.log("No data!");
	}
}

Pop3.prototype.connect = function(user, password){
	email.creator = user.id;
    pop.email = user.email;
    pop.password = password;
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

module.exports = new Pop3();
