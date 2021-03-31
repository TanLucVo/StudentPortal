const mongoose = require('mongoose')
const StatusSchema = mongoose.Schema({
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
module.exports = mongoose.model('comment', StatusSchema)