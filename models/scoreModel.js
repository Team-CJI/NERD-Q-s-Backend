const mongoose = require('mongoose');
const { Schema } = mongoose;

const scoreSchema = new Schema({
    "score": { type: String, required: true },
})

const scoreModel = mongoose.model('scoreModel', scoreSchema);

module.exports = scoreModel;