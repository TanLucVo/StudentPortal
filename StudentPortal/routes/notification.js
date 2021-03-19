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
	console.log(maphong)
	let user = await User.find({type : maphong})
	console.log(user)
	res.send('Trag thong bao');
});




module.exports = router