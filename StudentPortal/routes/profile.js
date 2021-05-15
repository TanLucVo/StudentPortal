var express = require('express');
var router = express.Router();

const {authenticateToken} = require('../config/token')

router.get('/',authenticateToken, (req, res, next) => {
    var id = req.query
    res.render('profile', {
        user: req.user
    })
})

module.exports = router