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
    },
    dices: {
        shape: {
            type: String,
            enum: ['Gost', 'Snail'],
            default: undefined
        },
        color: {
            type: String,
            enum: ['Blue', 'Orange'],
            default: undefined
        },
        texture: {
            type: String,
            enum: ['Dotted', 'Striped'],
            default: undefined
        },
        direction: {
            type: String,
            enum: ['Left', 'Right'],
            default: undefined
        }
    }
});

module.exports = mongoose.model('Round', RoundSchema);
