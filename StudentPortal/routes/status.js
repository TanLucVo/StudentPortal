var express = require('express')
const passport = require('passport')
var router = express.Router()

// api status: GET POST PUT DELETE

router.get('/',(req, res) => {
    res.json('success')
})

router.post('/',(req, res) => {
})

module.exports = router