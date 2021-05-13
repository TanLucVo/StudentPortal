const express = require('express')
const router = express.Router()

const {authenticateToken,authenticateTokenAPI} = require('../config/token')
const mongoose = require('mongoose')

const statusModel = require('../models/status')

const fetch = require("node-fetch");


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
router.get('/page/:skip', authenticateToken,async function(req, res, next) {
    const skip = parseInt(req.params.skip)
    // console.log("skip:",skip)
    const limit = 2

    // console.log("status API --- skip & limit")
    // console.log("đây là limit:",limit)
    // console.log("đây là skip:",skip)

    await statusModel.find().limit(limit).skip(skip)
    .sort({dateModified: 'desc'})
    .populate('user')
    .select('_id author statusTitle statusId dateModified like image user')
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
    let cookie = req.cookies
    const data = req.body

    let status = new statusModel({
        statusId: mongoose.Types.ObjectId(),
        like: undefined,
        statusTitle: data.statusTitle,
        dateModified: new Date(),
        user: req.user._id
    })

    let queryImg = {
        image: data.image,
        image_name: status._id,
        folder: `status/${status._id}`
    }

    const url = await fetch(`${process.env.URL}/api/upload-image-v2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
        },
        body: JSON.stringify(queryImg)
    }).then(res => res.text())
    .then(data => {
        data = JSON.parse(data)
        if (data.status) {
            return data.result.url
        }
    }).catch(error => {
        return res.status(500).json({
            status: false,
            error: error.message
        })
    })
    try {
        status.image = url
        const temp = await status.save()
        const newStatus = await statusModel.findById(temp._id).populate('user')
        if (newStatus == null || newStatus == undefined) {
            throw new Error('Server error. Please try again.')
        }
        return res.status(200).json({
            success: true,
            message: 'New status created successfully',
            Status: newStatus,
        });
    } catch (error) {
        throw new Error('Server error. Please try again.')
    }
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