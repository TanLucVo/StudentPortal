var express = require('express');
const createError = require("http-errors");
var router = express.Router();
const User = require('../models/user')
/* GET login page. */

router.get('/:id', async function (req, res, next) {
	let maphong = req.params.id
	if (maphong === "admin" || maphong === "student") {
		next(createError(404));
	}
	let phong = await User.findOne({ type: maphong })
	if (!phong) {
		return next(createError(404));
	}
	let user = await User.find()
	let department = user.filter(user =>  user.type !== "admin" && user.type !== 'student' )
	if(req.user.type !=="admin") return res.send('Access dineid')
	res.render('notificationPage',{user: req.user, departmentName:phong.name, department: department});
});




module.exports = router