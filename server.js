'use strict';
const axios = require('axios');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const ex = require('./models/ex.js');
const scoreModel = require('./models/scoreModel.js');
// const verifyUser = require('./authentication.js');
const PORT = process.env.PORT || 3001;
const getVideoGames = require('./module/triviaVideoGame.js');

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('connecting'))
.catch(err => console.log(`error: ${err}`))     

// optional method that sends us a message
// more complicated but gives you a confirmation
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // start your server and look for the console.log in terminal to confirm connection
  console.log('Mongoose is connected')
});    

app.get('/', (request, response) => {
    response.send('test request recieved')
})

// app.get('/videogames', handleGetVideogames);
app.get('/scores', handlePostScores);
// app.get('/cars', handleGetCars);
// app.get('/sports', handleGetSports);

// const TriviaModel = require('./models/ex.js');


const Data = { };

class VideoGame {
    constructor(videoGame) {
        this.category = videoGame.category;
        this.type = videoGame.type;
        this.difficulty = videoGame.difficulty;
        this.question = videoGame.question;
        this.correct_answer = videoGame.correct_answer;
        this.incorrect_answer = videoGame.incorrect_answer;
    }
}

async function handlePostScores(request, response) {
    // take score and pass to mongo
    
    try {
        let queryObj = {};
        if (request.query.score) {
            queryObj = { score: request.query.score }
            console.log(request.query.score)
        }
        let newScore = await scoreModel.create(request.query)


        if (newScore) {
            response.status(201).send(newScore);
        } else {
            response.status(500).send("Sorry, but your score could not be added. WOMP WOMP");
        }

        
    } catch (error) {
        console.error(error);
        response.status(500).send('Sorry, but your score could not be added. WOMP WOMP');
    }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));