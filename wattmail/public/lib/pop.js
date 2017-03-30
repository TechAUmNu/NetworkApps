var Pop3 = function(){
};

/**
 * Dependencies.
 */
var express = require('express');
var passport = require('passport');
var http = require('http');
var net = require("net");
var tls = require("tls");
var fs = require('fs');
var router = express.Router();

var host = "outlook.office365.com";
var port = 995;


Pop3.prototype.connect = function(io){
	Pop3.io = io;
	Pop3.io.socket = tls.connect({
			host: host,
			port: port,
			//rejectUnauthorized: !self.data.ignoretlserrs
		}, function() {   
			Pop3.io.socket.setEncoding('ASCII');
			Pop3.io.connected = true;
			if (Pop3.io.socket.authorized === false) {
				// authorization successful
				console.log("Error connecting to " + host + ":" + port);
			} else {
				console.log("Connected to " + host + ":" + port);
			}
		}
	);
};

Pop3.prototype.login = function(email, password){
	io.socket.write('USER' + email + '\r\n');
	io.socket.addListener('data', function(data) {
		// received data		
		console.log(data);	
		io.socket.write('PASS' + password + '\r\n');	
		io.socket.addListener('data', function(data) {
		// received data		
		console.log(data);
		});
	});	
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
