const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    email: {
        type : String,
        required : true
    },
    name: {
        type : String,
        required : true
    },
},{
    collection: 'User'
});
module.exports = mongoose.model('Users', UserSchema)