const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    statusId: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    dateModified: {
        type: Date,
        require: true,
    }
})
module.exports = mongoose.model('comments', CommentSchema)