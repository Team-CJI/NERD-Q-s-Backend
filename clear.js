'use strict';

// the purpose of this file is to hold a function that will clear our database of all data. 
// this is helpful when in development and working with seeded (fake) data

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI);
const scoreModel = require('./models/scoreModel');

async function clear() {
    try {
        await scoreModel.deleteMany({});
        console.log('Trivia cleared!');
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}


module.exports = {
    clear: clear
  };