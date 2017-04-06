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

var pop = {
    email: '',
    password: ''
}

// Received email data is stored in this packet
var packet;

// Stores the number of emails
var email_list_count = 0;
var email_list_size = 0;

// The state that the POP3 connection is in
var state = {
    /*
    Possible states are:
     - NOT_SENT
     - SENT
     - OK
     - ERROR
     - EXTRA_DATA
    */
    USERNAME: 'NOT_SENT',
    PASSWORD: 'NOT_SENT',
    STAT: 'NOT_SENT',
    LIST: 'NOT_SENT',
    RETR: 'NOT_SENT',
    QUIT: 'NOT_SENT',
    LOGIN: false
}

var creator;

/*
* Name:         decodeData
* Description:  Is used to parse the email data
*/
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
            pop3_id: email_list_size,
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
                            if(email_list_count < 50){
                            email_list_count++;
                            packet = '';
                            Pop3.sock.write("RETR " + email_list_size + "\r\n");
                            email_list_size++;
                            } else {
                                Pop3.prototype.close();
                            }
                        }
                    }
                    );
                }
              });
              } else {
                    if(email_list_count < 50){
                    email_list_count++;
                    packet = '';
                    Pop3.sock.write("RETR " + email_list_size + "\r\n");
                    email_list_size++;
                    } else {
                        Pop3.prototype.close();
                    }
               }
            });
    });
};

function onData(data) {
	if(data){
	    data = data.toString("ascii");
        var cmd = data.substr(0, 4).trim();
        if(cmd == "+OK") {
            if(state.USERNAME == 'NOT_SENT') {
                Pop3.sock.write("USER " + pop.email + "\r\n");
                state.USERNAME = 'SENT';
            } else if(state.USERNAME == 'SENT') {
                state.USERNAME = 'OK';
                Pop3.sock.write("PASS " + pop.password + "\r\n");
                state.PASSWORD = 'SENT';
            } else if(state.PASSWORD == 'SENT') {
                state.PASSWORD = 'OK';
                Pop3.sock.write("LIST\r\n");
                state.LIST = 'SENT';
            } else if(state.LIST == 'SENT'){
                var list_return = data.split("\r\n");
                var temp_data;
                for (var i = 0; i < list_return.length; i++) {
                    temp_data = list_return[i].split(" ");
                    if (temp_data[0] != "+OK" && temp_data[0] != "" && temp_data[0] != ".") {
                        email_list_size++;
                    }
                }
                if (data.substring(data.length - 3, data.length) == ".\r\n") {
                    email_list_size -= 50;
                    state.LIST = 'OK';
                    Pop3.sock.write("RETR " + email_list_size + "\r\n");
                } else {
                    state.LIST = 'EXTRA_DATA';
                }
            } else if(state.QUIT == 'SENT'){
                state.USERNAME = 'NOT_SENT';
                state.PASSWORD = 'NOT_SENT';
                state.STAT = 'NOT_SENT';
                state.LIST = 'NOT_SENT';
                state.RETR = 'NOT_SENT';
                state.QUIT = 'NOT_SENT';
                email_list_count = 0;
                email_list_size = 0;
                console.log("Connection closed to " + host + ":" + port);
            }
        } else {
            if(state.USERNAME == 'SENT') {
                state.USERNAME = 'ERROR';
                console.log("Incorrect Email!");
            } else if(state.PASSWORD == 'SENT') {
                state.PASSWORD = 'ERROR';
                console.log("Incorrect Password!");
            } else if(state.LIST == 'SENT') {
                state.LIST = 'ERROR';
                console.log("List Error!");
            } else if(state.QUIT == 'SENT'){
                state.QUIT = 'ERROR';
                console.log("Failed to close the connection!");
            } else {
                if(state.LIST == 'EXTRA_DATA'){
                    var list_return = data.split("\r\n");
                    var temp_data;
                    for (var i = 0; i < list_return.length; i++) {
                        temp_data = list_return[i].split(" ");
                        if (temp_data[0] != "+OK" && temp_data[0] != "" && temp_data[0] != ".") {
                            email_list_size++;
                        }
                    }
                    if (data.substring(data.length - 3, data.length) == ".\r\n") {
                        email_list_size -= 50;
                        Pop3.sock.write("RETR " + email_list_size + "\r\n");
                        state.LIST = 'OK';
                    }
                } else if(data.substring(data.length - 3, data.length) == ".\r\n"){
                    //Form the message to be saved
                    packet += data;
                    decodeData(packet);
                } else {
                    packet += data;
                }
            }
        }
	} else {
		console.log("No data!");
	}
}

function onClose(data) {
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
    Pop3.sock.write("QUIT\r\n");
    state.QUIT = 'SENT';
}

module.exports = new Pop3();
