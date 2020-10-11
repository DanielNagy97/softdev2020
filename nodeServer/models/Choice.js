const mongoose = require('mongoose');

const ChoiceSchema = mongoose.Schema({
    playerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Player',
        required: true
    },
    roundID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round',
        required: true
    },
    choice:{
        card: {type: String},
        time: {type: Date}
    }
});

module.exports = mongoose.model('Choice', ChoiceSchema);
