const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({
    address: {
        type: String
    },
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    features: [{
        type: Number,
    }],
    fireId: {
        type: String
    },
    imagePath: {
        type: String
    },
    imageUrl: {
        type: String
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    parkingType: {
        type: String
    },
    ratings: [{
        authorId: String,
        stars: Number
    }],
    vvId: {
        type: String
    }
});

module.exports = mongoose.model('Location', locationSchema);