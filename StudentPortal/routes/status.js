const express = require('express')
const passport = require('passport')
const router = express.Router()
const {createStatus} = require('../controllers/statusController')
const {authenticateToken} = require('../config/token')
// api status: GET POST PUT DELETE

router.get('/',(req, res) => {
    res.json("success")
})

router.post('/',createStatus, authenticateToken, function(req, res, next) {
    res.json("success")
})

module.exports = router