const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    roomID: {
        type: Number,
        ref:'Room',
        required: true
    }
});

module.exports = mongoose.model('Player', PlayerSchema);
