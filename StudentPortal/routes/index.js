var express = require('express');
const passport = require('passport');
var router = express.Router();
const {authenticateToken} = require('../config/token')

const fs = require('fs')
const bodyParser = require('body-parser') // body-parser xử lý url-encoded (html body)
const multer = require('multer')

const upload = multer({dest:'uploads',
    fileFilter:  (req, file, callback ) => {
        // xác định file được upload có phải là ảnh hay không đựa vào cơ chế mimetype: 'image/*'
        // nếu không phải gọi callback = false ngược lại cho phép upload callback = true

        if (file.mimetype.startsWith('image/')) {
            callback(null, true) // cho phép upload 
        }
        else {
            callback(null, false) // chặn không cho upload file
        }
    },
    limits: {
        fileSize: 1000000 // 1mb max
    }
})

/* GET users listing. */
router.get('/' , authenticateToken, function(req, res) {
  res.render('index',{user: req.user});
});

router.post('/', authenticateToken, upload.single('imageStatus'), function(req, res, next) {
  console.log(req.file)
});

module.exports = router;
