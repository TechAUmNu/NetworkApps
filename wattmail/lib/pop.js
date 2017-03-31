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
var list_count = 2;
var email_list_size = 0;
var pop = {
    email: '',
    password: ''
};

var state = {
    login: false,
    idle: false
}

var creator;

function decodeData(data){
        var email = {
            creator: creator,
            to_emails: [],
            cc_emails: [],
            bcc_emails: [],
            from_emails: [],
            from_email: '',
            from_name: '',
        };
        simpleParser(data, (err, mail)=>{
        if(mail.messageId){
            email.messageId = mail.messageId;
        }
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
            email.from_email = mail.from.value[0].address;
            email.from_name = mail.from.value[0].name;
        }
        if(mail.subject){
            email.subject = mail.subject;
        }
        if(typeof mail.subject == 'undefined'){
					email.subject = "No Subject";
		}

        var message = new Message({
            pop3_id: email.messageId,
            to_emails: email.to_emails,
            cc_emails: email.cc_emails,
            bcc_emails: email.bcc_emails,
            from_emails: email.from_emails,
            from_email: email.from_email,
            from_name: email.from_name,
            subject: email.subject,                      
            content: mail.text,
            creator: email.creator,
            html: mail.html,
            mailbox: 'inbox',
            date: mail.date,
        });
        //Save the message to the database
        Message.find({pop3_id: message.pop3_id}, function(error, cb){
            if(cb.length == 0){
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
                            if(list_count < 50){
                            list_count++;
                            packet = '';
                            Pop3.sock.write("RETR " + list_count + "\r\n");
                            }
                        }
                    }
                    );
                }
              });
              } else {
                if(list_count < 50){
                list_count++;
                packet = '';
                Pop3.sock.write("RETR " + list_count + "\r\n");
                }
                console.log("Email already saved");
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
                    state.login = true;
                    Pop3.sock.write("LIST\r\n");
                    count++;
                } else if(count == 3) {
                    Pop3.sock.write("RETR " + list_count + "\r\n");
                    count++;
                }
            } else {
                console.log("Received unknown command: " + cmd);
			}
		} else if(data.substring(data.length - 3, data.length) == ".\r\n"){
            //Form the message to be saved
            packet += data;
            decodeData(packet);
		} else {
		    packet += data;
		}
	} else {
		console.log("No data!");
	}
}

function onClose(data) {
   state.login = false;
   data = data.toString("ascii");
   console.log("Closing session");
}

Pop3.prototype.connect = function(user, password){
	creator = user.id;
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
    Pop3.sock.on('close', onClose);
};

Pop3.prototype.close = function(){
    Pop3.sock.write("OUIT\r\n");
    state.login = false;
    console.log("Closed connection to " + host + ":" + port);
}
module.exports = new Pop3();
