const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    busData: {
        type: String,
        required: true
    },

    stopData: {
        type: String,
        required: true
    },

    remindData: {
        type: String
    }
})

module.exports = mongoose.model('userData', schema, 'userData');
