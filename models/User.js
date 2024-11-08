const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Must provide Username'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Must provide Email'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Must provide Password'],
        trim: true,
    },   
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user' 
    }
    
    
}, {collection: 'users'})

module.exports = mongoose.model('User', UserSchema);