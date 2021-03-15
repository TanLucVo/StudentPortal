const mongoose = require('mongoose')
const StatusSchema = mongoose.Schema({
    statusId: {
        type: String,
        require: true,
    },
    comment: {
        type: String,
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
module.exports - mongoose.model('status', StatusSchema)