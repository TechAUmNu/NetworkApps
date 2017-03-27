var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'wattmail - login' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'wattmail - register' });
});


module.exports = router;
