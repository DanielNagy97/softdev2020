const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    //Cannot specify a custom index on `_id` for model name "Room",
    //MongoDB does not allow overwriting the default `_id` index.
    //TODO: Make this possible!
    _id: {
        type: Number,
        unique: true,
        required: true
    },
    //Seed for board generating function
    boardSeed: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Room', RoomSchema);
