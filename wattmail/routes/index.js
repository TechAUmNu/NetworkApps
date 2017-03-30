module.exports = function(io){
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
	res.render('index', {username:username, email:email, hw_sync_complete: req.query.sync, user_id: req.user.id});
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

