const mongoose = require('mongoose')
const statusModel = require('../models/status')

async function createStatus(req, res) {
  const status = new statusModel({
      statusId: mongoose.Types.ObjectId(),
      comment: req.body.comment,
      image: req.body.image,
      userId: req.body.userId
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
  await statusModel.find()
    .select('_id statusId comment image userId')
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

async function getStatusId(req, res) {
  const id = req.params.id
  await statusModel.findById(id)
  .then((singleStatus) => {
    res.status(200).json({
      success: true,
      message: `More on ${singleStatus.statusId}`,
      Course: singleStatus,
    });
  })
  .catch((err) => {
    res.status(500).json({
      success: false,
      message: 'This status does not exist in database',
      error: err.message,
    });
  });
}

async function deleteStatusId(req, res) {
  const id = req.params.id
  await statusModel.findByIdAndRemove(id)
    .exec()
    .then(()=> res.status(204).json({
      success: true,
    }))
    .catch((err) => res.status(500).json({
      success: false,
    }));
}

async function updateStatusId(req, res) {
  const log =  await statusModel.findOneAndUpdate(
    {_id: req.params.id},
    {
      comment: req.body.comment
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
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: err.message,
    });
  });
}

module.exports = {createStatus, getAllStatus, getStatusId, deleteStatusId, updateStatusId}