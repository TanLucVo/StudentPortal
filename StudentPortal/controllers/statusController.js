const mongoose = require('mongoose')
const statusModel = require('../models/status')

async function createStatus(req, res) {
    const status = new statusModel({
        statusId: mongoose.Types.ObjectId(),
        comment: req.body.comment,
        image: "no image",
        userId: req.user.userId
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
        console.log(error);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: error.message,
      });
    });
}

async function getAllStatus(req, res) {
  statusModel.find()
    .select('_id statusId image userId')
    .then((allStatus) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all status',
        Status: allStatus,
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

module.exports = {createStatus, getAllStatus}