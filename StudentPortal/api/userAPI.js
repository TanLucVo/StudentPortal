const express = require('express')
const passport = require('passport')
const router = express.Router()
const {authenticateToken,authenticateTokenAPI} = require('../config/token')
const mongoose = require('mongoose')
const userModel = require('../models/user')
const socketIO = require("../config/socketIO")

const io = socketIO.io;


// api user: GET
// TẤT CẢ ĐỀU SÀI _id của mongodb tự động tạo để sử dụng CRUD
// GET

router.get('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await userModel.findById(id)
    .then((singleUser) => {
        res.status(200).json({
        success: true,
        message: `More on ${singleUser._id}`,
        user: singleUser,
        });
    })
    .catch((err) => {
        res.status(500).json({
        success: false,
        message: 'This user does not exist in database',
        error: err.message,
        });
    });
})
module.exports = router