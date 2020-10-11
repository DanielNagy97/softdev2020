const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    roomID: {
        type: Number,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Room', RoomSchema);
