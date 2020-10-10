const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
    //TODO: Játékos validálás
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
    }
});

module.exports = mongoose.model('Player', PlayerSchema);
