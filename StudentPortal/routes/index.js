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
router.get('/' , authenticateToken,async function(req, res) {
    cookie = req.cookies
    // khai báo khi vào index mặc định load 3 status
    const page = 1
    await fetch(process.env.URL + `/status/page/${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
        }
    })
    .then(res => res.text())
    .then(async json => {
        if (JSON.parse(json).success) {
            let checkLike = false
            let arraySortStatus = JSON.parse(json).Status.map(async status => {
    
                startTime = new Date(status.dateModified)
                endTime = new Date()
                const currentTime = getCurrentTime(startTime, endTime)
                status["currentTime"] = currentTime
    
                // parse array like - json
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
    
                // fetch get comment API: lấy các comment trong 1 status
                let comments = await fetch(`${process.env.URL}/comment/status/${status._id}/${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
                    }
                })
                .then(res => res.text())
                .then(async data => {
                    if (JSON.parse(data).success) {
                        let comments = JSON.parse(data).Comment.map(async comment => {
                            const timeComment = getCurrentTime(new Date(comment.dateModified), new Date())
                            comment['dateModified'] = timeComment

                            const commentNew = await fetch(`${process.env.URL}/user/${comment.author}`,{
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
                                }
                            })
                            .then(res => res.text())
                            .then(dataAuthorComment => {
                                authorComment = JSON.parse(dataAuthorComment)
                                if (authorComment.success) {
                                    comment['imgAuthor'] = authorComment.user.image
                                    comment['nameAuthor'] = authorComment.user.name
                                    // console.log(comment)
                                    return comment
                                }
                                else {
                                    return undefined
                                }
                            }).catch(e => {
                                console.log(e)
                                return res.render('index',{user: req.user, allStatus: []});
                            })

                            // console.log(JSON.parse(commentNew))
                            return commentNew
                        })
                        
                        return await Promise.all(comments)
                    }
                    return undefined
                }).catch(e => {
                    console.log(e)
                    return res.render('index',{user: req.user, allStatus: []});
                })
                status['comments'] = comments
                // console.log(status)
                return status
                // console.log(comments)
            });
            resultStatus = await Promise.all(arraySortStatus)
            // log 1 comment của 1 status
            // console.log(resultStatus[0])
            // console.log(resultStatus[0].comments)
            // console.log(resultStatus[0].comments.length)
            // console.log("đổ data thành công")
            return res.render('index',{user: req.user, allStatus: resultStatus});
        }
        return res.render('index',{user: req.user, allStatus: []});
    })
    .catch(e => {
        console.log(e)
        return res.render('index',{user: req.user, allStatus: []});
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
    fetch(process.env.URL + '/status', {
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
