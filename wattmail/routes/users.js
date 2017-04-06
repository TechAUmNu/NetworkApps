var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){	
	res.render('users/register');
});

// Login
router.get('/login', function(req, res){
	res.render('users/login', {redirect: '/users/login'});
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Basic validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	// Validate username (checks if username has already been taken)
    User.getUserByUsername(username, function(username_err, username_found){
        if(username_err){
            res.render('users/register',{
                errors:errors
            });
        } else {
            if(username_found){
                if(errors){
                    errors.push({
                        param: 'username',
                        msg: 'Username has already been taken',
                        value: username
                    });
                    res.render('users/register',{
                        errors:errors
                    });
                } else {
                    errors = [{
                        param: 'username',
                        msg: 'Username has already been taken',
                        value: username
                    }];
                    res.render('users/register',{
                        errors: errors
                    });
                }
            } else {
                // Validate email (checks if email has already been taken)
                User.findOne({email: email}, function(email_err, email_found){
                    if(email_err){
                        console.log("Register:" + email_err);
                        res.render('users/register',{
                            errors:errors
                        });
                    } else {
                        if(email_found){
                            if(errors){
                                errors.push({
                                    param: 'email',
                                    msg: 'Email has already been taken',
                                    value: email
                                });
                                res.render('users/register',{
                                    errors:errors
                                });
                            } else {
                                errors = [{
                                    param: 'email',
                                    msg: 'Email has already been taken',
                                    value: email
                                }];
                                res.render('users/register',{
                                    errors: errors
                                });
                            }
                        } else {
                            // Email and Username has not been used
                            if(errors){
                                res.render('users/register',{
                                    errors:errors
                                });
                            } else {
                                var newUser = new User({
                                    name: name,
                                    email:email,
                                    username: username,
                                    password: password
                                });

                                User.createUser(newUser, function(err, user){
                                    if(err) throw err;
                                    console.log(user);
                                });

                                res.redirect('/users/login');
                            }
                        }
                    }
                });
            }
        }
	});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/email', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
	
    res.redirect('/email' );

  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
