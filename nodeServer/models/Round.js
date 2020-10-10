const mongoose = require('mongoose');
const ChoiceSchema = require('./Choice');

const RoundSchema = mongoose.Schema({
    master: {
        type: String,
        ref:'Player',
        required: true
    },
    choices: {
        //Nem biztos, hogy így kell
        //TODO: utánanézni!!!
        type: [ChoiceSchema],
        required: true
    }
});

module.exports = mongoose.model('Round', RoundSchema);
