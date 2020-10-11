const mongoose = require('mongoose');

const RoundSchema = mongoose.Schema({
    master: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Player',
        required: true
    },
    roomID: {
        type: Number,
        ref:'Room',
        required: true
    }
});

module.exports = mongoose.model('Round', RoundSchema);
