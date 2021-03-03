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
	// try {
	// 	const newUser = new user({
	// 		name : "!23",
	// 		email:"123123"
	// 	})
	// 	await newUser.save()
	// } catch (error) {
	// 	console.log(error)
	// }
});

// POST login page
router.post('/', function (req, res, next) {
	res.render('login', {
		title: 'Express'
	});
});

module.exports = router;