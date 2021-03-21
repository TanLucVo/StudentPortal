var express = require('express');
const createError = require("http-errors");
const Permission = require('../models/permission');
var router = express.Router();
const User = require('../models/user')
/* GET login page. */

router.get('/:id', async function (req, res, next) {
	let maphong = req.params.id.toUpperCase()
	if (maphong === "admin" || maphong === "student") {
		next(createError(404));
	}
	let phong = await User.findOne({ type: maphong })
	if (!phong) {
		return next(createError(404));
	}
	let user = await User.find()
	let department = user.filter(user =>  user.type !== "admin" && user.type !== 'student' )
	
	let permissionToAdd =await Permission.findOne({maphong: req.user.type})
	let isAdd;
	if(permissionToAdd && permissionToAdd.maphong.includes(maphong)){
		isAdd = true
	}else{
		isAdd= false
	}
	
	res.render('notificationPage',{user: req.user, departmentName:phong, department: department, isAdd});
});


module.exports = router