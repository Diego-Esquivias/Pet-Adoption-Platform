const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide name'],
        trim: true,
    },
    breed:{
        type: String,
        required: [true, 'Must provide breed'],
        trim: true,
    },
    age:{
        type: Number,
        required: [true, 'Must provide age'],
        trim: true,
    },
    description:{
        type: String,
        required: [true, 'Must provide description'],
        trim: true,
    },
    behavior:{
        type: String,
        required: [true, 'Must provide behavior'],
        trim: true,
    },
    history:{
        type: String,
        required: [true, 'Must provide behavior'],
        trim: true,
    },
    mainImage:{
        type: String,
        trim: true,
    }
    
}, {collection: 'pets'})

module.exports = mongoose.model('Pet', PetSchema);