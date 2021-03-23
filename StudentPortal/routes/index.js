var express = require('express');
const passport = require('passport');
var router = express.Router();
const {authenticateToken} = require('../config/token')
const multer = require('multer')
const fs = require('fs')
const fetch = require("node-fetch");
const {getCurrentTime} = require('../config/currentTime')


// express.static middleware -> ảnh từ phía client ko thể lấy qua server được cần thiết lập express.static
// `/uploads` sẽ lấy ảnh từ server thông qua url: http://localhost:4200/uploads, còn uploads là folder bên server lưu ảnh được upload
router.use('/uploads',express.static('uploads'))
var request = require("request");
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
    cookie = req.cookies
    fetch('http://localhost:3000/status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
        }
    })
    .then(res => res.text())
    .then(json => {
        // JSON.parse(json).sort(function(a,b){
        //     return new Date(b.date) - new Date(a.date);
        // });
        arraySortStatus = JSON.parse(json).Status
        arraySortStatus.sort(function(a,b){
            return new Date(b.dateModified) - new Date(a.dateModified);
        });
        arraySortStatus.forEach(status => {

            startTime = new Date(status.dateModified)
            endTime = new Date()
            const currentTime = getCurrentTime(startTime, endTime)
            status["currentTime"] = currentTime
        });
        // parse array like - json
        let checkLike = false
        console.log(arraySortStatus)
        // console.log(arraySortStatus)
        arraySortStatus.forEach(status => {
            // parse thành json
            // lúc khởi tạo status.like chưa có trong model vì vậy ta phải kiểm tra tính xác thức của nó
            if (!status.like) {
                status.like = []
                status.checkLike = false
            }
            else {
                status.like = JSON.parse(status.like)
                status.like.forEach(l => {
                    if (req.user._id == l._id) {
                        checkLike = true
                    }
                });
                status.checkLike = checkLike
                // gắn lại giá trị default cho biến checkLike để sử dụng cho element vòng lặp kế tiếp
                checkLike = false
            }
        });
        // console.log("check_like old",checkLike)

        // console.log("check_like old",checkLike)

        return res.render('index',{user: req.user, allStatus: arraySortStatus});
    })
    .catch(e => {
        console.log(e)
        return res.render('index',{user: req.user});
    })
});

router.post('/', authenticateToken, upload.single('imageStatus'), async function(req, res, next) {
    const statusTitle = req.body.statusTitle // form fields
    let image = req.file // form files
    const author = req.body.author
    // console.log(author)

    cookie = req.cookies
    let status
    if (!image) {
        image = undefined
        status = {
            statusTitle: statusTitle,
            image: image,
            author: author
        }
    }
    else {
        fs.renameSync(image.path, `uploads/${image.originalname}`)
        status = {
            statusTitle: statusTitle,
            image: `uploads/${image.originalname}`,
            author: author
        }
    }
    fetch('http://localhost:3000/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
            },
            body: JSON.stringify(status)
        })
        .then(res => res.json())
        .then(json => {
            // console bên node server
            startTime = new Date(json.Status.dateModified)
            endTime = new Date()
            const currentTime = getCurrentTime(startTime, endTime)
            json.Status["currentTime"] = currentTime
            return res.json(json)
        })
        .catch(e => {
            console.log(e)
        })
});

module.exports = router;
