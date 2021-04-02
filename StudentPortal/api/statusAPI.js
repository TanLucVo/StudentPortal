const express = require('express')
const passport = require('passport')
const router = express.Router()
const {authenticateToken,authenticateTokenAPI} = require('../config/token')
const mongoose = require('mongoose')
const statusModel = require('../models/status')


// api status: GET POST PUT DELETE
// TẤT CẢ ĐỀU SÀI _id của mongodb tự động tạo để sử dụng CRUD
// GET

// GET ALL STATUS
router.get('/', authenticateToken,async function(req, res, next) {
    await statusModel.find()
    .sort({dateModified: 'desc'})
    .select('_id author statusTitle statusId dateModified like image')
    .then((allStatus) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all status',
        Status: allStatus,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
})

// GET LIMIT STATUS
router.get('/page/:page', authenticateToken,async function(req, res, next) {
    const {page} = req.params

    const limit = 2
    const skip = (parseInt(page) * 2) - 2 // 2n - 2

    console.log("status API --- skip & limit")
    console.log("đây là limit:",limit)
    console.log("đây là skip:",skip)

    await statusModel.find().limit(limit).skip(skip)
    .sort({dateModified: 'desc'})
    .select('_id author statusTitle statusId dateModified like image')
    .then((allStatus) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all status',
        Status: allStatus,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
})

// GET STATUS BY ID
router.get('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await statusModel.findById(id)
    .then((singleStatus) => {
        return res.status(200).json({
        success: true,
        message: `More on ${singleStatus.statusId}`,
        Status: singleStatus,
        });
    })
    .catch((err) => {
        return res.status(500).json({
        success: false,
        message: 'This status does not exist in database',
        error: err.message,
        });
    });
})

// POST

// POST STATUS
router.post('/', authenticateToken,async function(req, res, next) {
    if (!req.body) {
        return res.status(500).json({
                success: false,
                message: 'data error. Please try again.',
                error: error.message,
        });
    }
    const data = req.body
    const status = new statusModel({
        statusId: mongoose.Types.ObjectId(),
        author: data.author,
        like: undefined,
        statusTitle: data.statusTitle,
        dateModified: new Date(),
        image: data.image
    })
    await status
    .save()
    .then((newStatus) => {
        return res.status(201).json({
        success: true,
        message: 'New status created successfully',
        Status: newStatus,
        });
    })
    .catch((error) => {
        return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: error.message,
        });
    });
})

// PUT STATUS BY ID

router.put('/:id' ,authenticateToken,async function(req, res, next) {
    if (!req.body) {
        return res.status(500).json({
                success: false,
                message: 'data error. Please try again.',
                error: error.message,
        });
    }
    const log =  await statusModel.findOneAndUpdate(
        {_id: req.params.id},
        {
            author: req.body.author,
            statusTitle: req.body.statusTitle,
            image: req.body.image,
            like: req.body.like,
            dateModified: req.body.dateModified
        },
        {
            useFindAndModify: false,
            upsert: false,
            new: true
        }
    )
    .exec()
    .then((oldStatus) => {
        return res.status(200).json({
            success: true,
            message: 'this status was updated successfully',
            Status: oldStatus,
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: err.message,
        });
    });
})

// DELETE STATUS BY ID

router.delete('/:id' ,authenticateToken,async function(req, res, next) {
    const id = req.params.id
    await statusModel.findByIdAndRemove(id)
    .exec()
    .then(()=> {
        return res.status(204).json({
            success: true,
            message: 'this status was deleted successfully',
        })
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            error: err.message,
        })
    });
})
module.exports = router