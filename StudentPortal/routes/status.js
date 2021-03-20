const express = require('express')
const passport = require('passport')
const router = express.Router()
const {createStatus, getAllStatus, getStatusId, deleteStatusId, updateStatusId} = require('../controllers/statusController')
const {authenticateToken,authenticateTokenAPI} = require('../config/token')


// api status: GET POST PUT DELETE

// GET

router.get('/', authenticateToken,getAllStatus)

router.get('/:id' ,authenticateToken,getStatusId)

// POST

router.post('/', authenticateToken,createStatus)

// PUT

router.put('/:id' ,authenticateToken,updateStatusId)

// DELETE

router.delete('/:id' ,authenticateToken,deleteStatusId)
module.exports = router