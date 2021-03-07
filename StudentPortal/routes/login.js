var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport'); 



/* GET login page. */
router.get('/',async function (req, res, next) {
	res.render('login', {
		title: 'Express'
	});
});

// POST login page
router.post('/', function (req, res, next) {
	res.render('login', {
		title: 'Express'
	});
});
//signin with google
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
	  res.redirect('/')
	}
  )

module.exports = router;