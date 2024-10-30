const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Must provide Username'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Must provide Password'],
        trim: true,
    },    
    
}, {collection: 'users'})

module.exports = mongoose.model('User', UserSchema);