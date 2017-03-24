var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'wattmail' });
});


/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'wattmail' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'wattmail' });
});

module.exports = router;