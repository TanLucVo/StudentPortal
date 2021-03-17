const express = require('express')
const passport = require('passport')
const router = express.Router()
const {createStatus, getAllStatus} = require('../controllers/statusController')
const {authenticateToken} = require('../config/token')
// api status: GET POST PUT DELETE

router.get('/', getAllStatus, authenticateToken)
router.post('/',createStatus, authenticateToken)

module.exports = router