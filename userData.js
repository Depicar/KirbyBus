const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    busData: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('userData', schema, 'userData');
