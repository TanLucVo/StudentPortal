const mongoose = require('mongoose')
const StatusSchema = mongoose.Schema({
    statusId: {
        type: String,
        require: true,
    },
    statusTitle: {
        type: String,
        require: true,
    },
    dateModified: {
        type: Date,
        require: true,
    },
    image: {
        type: String,
    },
    userId: {
        type: String,
        require: true,
    }
})
module.exports = mongoose.model('status', StatusSchema)