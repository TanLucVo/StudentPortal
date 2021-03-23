var express = require("express");
const createError = require("http-errors");
const notification = require("../models/notification");
const Permission = require("../models/permission");
var router = express.Router();
const User = require("../models/user");
const fetch = require("node-fetch");
/* GET login page. */

router.get("/:id", async function (req, res, next) {
	let maphong = req.params.id;
	if (maphong === "admin" || maphong === "student") {
		next(createError(404));
	}
	let phong = await User.findOne({
		type: maphong,
	});
	if (phong === null) {
		return next(createError(404));
	}
	let department = await User.find({
		$and: [
			{
				type: {
					$ne: "admin",
				},
			},
			{
				type: {
					$ne: "student",
				},
			},
		],
	});
	let url = process.env.URL || "http://localhost:3000";
	const result = await fetch(url + "/api/notification", {
		method: "GET",
		credentials: "same-origin",

		headers: {
			"Content-Type": "application/json",
			Cookie: `connect.sid=${req.cookies["connect.sid"]}; token=${req.cookies.token}`,
		},
	});
	let data = await result.json();
	data = data.data
	data.forEach(e =>{
		let d = new Date(e.createAt);
		e.createAt = d.toJSON().slice(0,10).split('-').reverse().join('-')
	})
	let permissionToAdd = await Permission.findOne({
		maphong: req.user.type,
	});
	let isAdd = false;
	if (
		permissionToAdd != null &&
		permissionToAdd.department.includes(maphong)
	) {
		isAdd = true;
	} else {
		isAdd = false;
	}

	res.render("notificationPage", {
		user: req.user,
		departmentName: phong,
		department: department,
		isAdd: isAdd,
		notification: data
	});
});

module.exports = router;
