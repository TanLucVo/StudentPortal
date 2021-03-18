var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs'); 
const User = require('../models/user')
/* GET login page. */
router.get('/', async function (req, res, next) {
	const data = fs.readFileSync(path.join(__dirname, '..','/views/partial/showDepartment.ejs'))
	res.render('dashboardDepartment',{user: req.user, content:data});
});

//post
router.get('/add', async function (req, res, next) {
	let user = await User.find()
	let department = user.filter(user =>  user.type !== "admin" && user.type !== 'student' )
	if(req.user.type !=="admin") return res.send('Access dineid')
	res.render('addDepartment',{user: req.user, department:department});
});

router.post('/add', async function (req, res, next) {
	console.log(req.body)
	res.send('post')
	// if(req.user.type !=="admin") return res.status(403).json('Access dineid')
	// res.render('addDepartment',{user: req.user});
});


module.exports = router