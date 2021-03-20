var express = require('express');
const passport = require('passport');
var router = express.Router();
const {authenticateToken} = require('../config/token')
const multer = require('multer')
const fs = require('fs')
const bodyParser = require('body-parser')

// express.static middleware -> ảnh từ phía client ko thể lấy qua server được cần thiết lập express.static
// `/uploads` sẽ lấy ảnh từ server thông qua url: http://localhost:4200/uploads, còn uploads là folder bên server lưu ảnh được upload
router.use('/uploads',express.static('uploads'))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

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
    const statusTitle = req.body.statusTitle // form fields
    const image = req.file // form files
    const error = ""

//   if (!statusTitle) {
//       error = "Hãy nhập tiêu đề cho bài viết của bạn"
//   }
//   if (error.length > 0) {
//       res.render('/', {errorMessage: error})
//   }
//   else {
//     //   rename file upload

//   }

    fs.renameSync(image.path, `uploads/${image.originalname}`)
    const tokenJWT = req.cookies.token
    let status = {
        comment: statusTitle,
        image: `uploads/${image.originalname}`,
        userId: req.user.userId,
        cookie: `token=${tokenJWT}`
    }
    console.log(JSON.stringify(status))
    fetch('http://localhost:3000/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(status)
    })
    .then(res => res.json())
    .then(json => {
        console.log(json)
    })
    .catch(e => console.log(e))
});

module.exports = router;
