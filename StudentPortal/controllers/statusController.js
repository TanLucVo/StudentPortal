const mongoose = require('mongoose')
const statusModel = require('../models/status')

async function createStatus(req, res) {
    const status = new statusModel({
        statusId: mongoose.Types.ObjectId(),
        comment: req.body.comment,
        image: "no image",
        userId: "sdsdsd",
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

module.exports = {createStatus}