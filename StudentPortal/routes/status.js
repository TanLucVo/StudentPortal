var express = require('express')
var router = express.Router()

// api status: GET POST PUT DELETE

router.get('/',(req, res) => {
    res.render('status')
})

module.exports = router