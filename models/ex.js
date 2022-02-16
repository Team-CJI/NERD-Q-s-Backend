const mongoose = require('mongoose');
const { Schema } = mongoose;

const triviaSchema = new Schema({
    "category": { type: String, required: true },
    "type": { type: Boolean || String, required: true },
    "difficulty": { type: String, required: true },
    "question": { type: String, required: true },
    "correct_answer": { type: String, required: true },
    "incorrect_answers": { type: Array, required: true },
})

const Ex = mongoose.model('Ex', triviaSchema);

module.exports = Ex;