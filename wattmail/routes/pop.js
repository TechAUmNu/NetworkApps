module.exports = function(io){
var express = require('express');
var passport = require('passport');

/*
 * Module dependencies.
 */
var http = require('http');
var net = require("net");
var tls = require("tls");
var fs = require('fs');
var router = express.Router();

var host = "outlook.office365.com";
var port = 995;

function login(email, password){
	io.socket.write('USER' + email + '\r\n');
	io.socket.write('USER' + password + '\r\n');
};

io.socket = tls.connect({
		host: host,
		port: port,
		//rejectUnauthorized: !self.data.ignoretlserrs
	}, function() {   
		io.socket.setEncoding('ASCII');
		io.connected = true;
		if (io.socket.authorized === false) {
			// authorization successful
			console.log("Error connecting to " + host + ":" + port);
		} else {
			console.log("Connected to " + host + ":" + port);
		}
	}
);

io.socket.addListener('data', function(data) {
	// received data		
	console.log(data);
});
 
io.socket.addListener('error', function(error) {
	if (!io.connected) {
		// socket was not connected, notify callback
		connected(null);
		}
	console.log("FAIL");
	console.log(error);
});
 
io.socket.addListener('close', function() {
	// do something
	console.log("Conection closed");
});

return router;
}
