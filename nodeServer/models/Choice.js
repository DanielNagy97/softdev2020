const mongoose = require('mongoose');

const ChoiceSchema = mongoose.Schema({
    playerID: {
        type: String,
        ref:'Player',
        required: true
    },
    choice:{
        card: {type: String},
        time: {type: Date}
    }
});

module.exports = mongoose.model('Choice', ChoiceSchema);
