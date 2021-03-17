const express = require('express')
const passport = require('passport')
const router = express.Router()
const {createStatus, getAllStatus, getStatusId, deleteStatusId, updateStatusId} = require('../controllers/statusController')
const {authenticateToken} = require('../config/token')
// api status: GET POST PUT DELETE

// GET

router.get('/', getAllStatus, authenticateToken)

router.get('/:id',getStatusId ,authenticateToken)

// POST

router.post('/',createStatus, authenticateToken)

// PUT

router.put('/:ida',updateStatusId ,authenticateToken)

// DELETE

router.delete('/:id',deleteStatusId ,authenticateToken)
module.exports = router