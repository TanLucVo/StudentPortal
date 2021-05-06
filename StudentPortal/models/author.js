const mongoose = require('mongoose')
const AuthorSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        require: true,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId, ref: 'status',
        require: true,
    }
})
module.exports = mongoose.model('authors', AuthorSchema)