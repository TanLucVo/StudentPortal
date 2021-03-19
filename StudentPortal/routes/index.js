var express = require('express');
const passport = require('passport');
var router = express.Router();
const {authenticateToken} = require('../config/token')

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
  const statusTitle = JSON.stringify(req.body.statusTitle) // form fields
  const image = req.file // form files
  const error = ""

  if (!statusTitle) {
      error = "Hãy nhập tiêu đề cho bài viết của bạn"
  }
  if (error.length > 0) {
      res.render('/', {errorMessage: error})
  }
  else {
    //   rename file upload
    fs.renameSync(image.path, `uploads/${image.originalname}`)
   
    let status = {
        comment: statusTitle,
        image: 'not found hehe',
        userId: req.user.userId
    }
    console.log(JSON.stringify(status))
  }
});

module.exports = router;
