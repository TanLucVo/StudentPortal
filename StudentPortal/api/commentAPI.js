const express = require('express')
const passport = require('passport')
const router = express.Router()
const {authenticateToken,authenticateTokenAPI} = require('../config/token')
const mongoose = require('mongoose')
const commentsModel = require('../models/comment')
const socketIO = require("../config/socketIO")

const io = socketIO.io;


// api status: GET POST PUT DELETE
// TẤT CẢ ĐỀU SÀI _id của mongodb tự động tạo để sử dụng CRUD
// GET

router.get('/', authenticateToken,async function(req, res, next) {
    await commentsModel.find()
    .select('_id statusId author content dateModified')
    .then((allComment) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all comment',
        Status: allComment,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
})

router.get('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await commentsModel.findById(id)
    .then((singleComment) => {
        res.status(200).json({
        success: true,
        message: `More on ${singleComment._id}`,
        Status: singleComment,
        });
    })
    .catch((err) => {
        res.status(500).json({
        success: false,
        message: 'This comment does not exist in database',
        error: err.message,
        });
    });
})

// POST

router.post('/', authenticateToken,async function(req, res, next) {
    if (!req.body) {
        return res.status(500).json({
            success: false,
            message: 'data error. Please try again.',
            error: error.message,
        });
    }
    else {
    const data = req.body
    const comment = new commentsModel({
        _id: mongoose.Types.ObjectId(),
        statusId: data.statusId,
        author: data.author,
        content: data.content,
        dateModified: new Date()
    })
    await comment
    .save()
    .then((newComment) => {
        return res.status(201).json({
        success: true,
        message: 'New comment created successfully',
        Status: newComment,
        });

        
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: error.message,
        });
    });
    }
})

// PUT

router.put('/:id' ,authenticateToken,async function(req, res, next) {
    if (!req.body) {
        return res.status(500).json({
            success: false,
            message: 'data error. Please try again.',
            error: error.message,
        });
    }
    else {
        const log =  await commentsModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                statusId: req.body.statusId,
                author: req.body.author,
                content: req.body.content,
                dateModified: req.body.dateModified
            },
            {
                useFindAndModify: false,
                upsert: false,
                new: true
            }
        )
        .exec()
        .then((oldComment) => {
            return res.status(200).json({
                success: true,
                message: 'this comment was updated successfully',
                Status: oldComment,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });
    }
})

// DELETE

router.delete('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await commentsModel.findByIdAndRemove(id)
    .exec()
    .then(()=> res.status(204).json({
        success: true,
    }))
    .catch((err) => res.status(500).json({
        success: false,
    }));
})
module.exports = router