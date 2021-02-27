const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const Code = new Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('code', Code)
