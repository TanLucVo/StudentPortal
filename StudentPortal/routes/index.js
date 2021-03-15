var express = require('express');
const passport = require('passport');
var router = express.Router();
const {authenticateToken} = require('../config/token')
/* GET users listing. */
router.get('/' , authenticateToken, function(req, res) {
  res.render('index',{user: req.user});
});


module.exports = router;
