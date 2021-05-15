var express = require('express');
var router = express.Router();

const {authenticateToken} = require('../config/token')

const moment = require('moment')

const userModel = require('../models/user')

router.get('/',authenticateToken,async (req, res, next) => {
    var {id} = req.query
    let mainUser = req.user
    let checkUser = false
    if (id != req.user._id) {
        mainUser = await userModel.findById(id)
    }
    console.log(checkUser)
    res.render('profile', {
        user: req.user,
        mainUser,
        moment
    })
})

module.exports = router