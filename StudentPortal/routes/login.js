var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const user = require('../models/user');

/* GET login page. */
router.get('/',async function (req, res, next) {
	res.render('login', {
		title: 'Express'
	});
	user.find({}, function(err, result) {
		console.log(result)
	});
});

// POST login page
router.post('/', function (req, res, next) {
	res.render('login', {
		title: 'Express'
	});
});

module.exports = router;