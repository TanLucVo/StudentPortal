var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs'); 
const User = require('../models/user')
const addDepartmentValidator = require('../validator/addDepartmentValidator');
const { validationResult } = require('express-validator');
var mongoose = require('mongoose');
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

router.post('/add', addDepartmentValidator, async function (req, res, next) {
	let result = validationResult(req)
	console.log(req.body)
    if(result.errors.length ===0){
		let { username, pass, name, maphong, department } = req.body
		
        // console.log(username, pass, name, maphong, department)
        // const newUser = {
		// 	userId: mongoose.Types.ObjectId(),
		// 	name: name,
		// 	image: '',
		// 	type: maphong,
		// 	username:username,
		// 	password:pass
		// }
		return res.status(200).json({message:"ok"})
    }else{
        let messages =result.mapped()
        let message = ""
        for(m in messages){
            message = messages[m]
            break
        }
        return res.status(403).json({message:message})
    }
});


module.exports = router