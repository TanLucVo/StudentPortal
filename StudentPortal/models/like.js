const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
var crypto = require('crypto');
const LikeSchema = mongoose.Schema({
    likeId: {
        type: String,
        require: true,
    },
    user: {
        type: String,
        require: true,
    },
    statusId: {
        type: String,
        require: true,
    }
})
LikeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Likes', LikeSchema)