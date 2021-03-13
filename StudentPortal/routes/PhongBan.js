var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', async function (req, res, next) {
	res.render('PhongBan');
});
module.exports = router