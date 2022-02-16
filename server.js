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
const clear = require('./clear.js');


const verifyUser = require('./authentication.js');
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


app.post('/scores', handlePostScores);
app.get('/scores', handleGetScores);
app.get('/scores/clear', clear.clear);
app.get('/scores/update/:id', handleUpdateScores);
app.delete('/scores/:id', handleDeleteScores);
app.put('/scores/:id', handleUpdateScores);
app.get('/user', handleGetUser);


const Data = { };

function handleGetUser(req, res) {
  // verifyUser is defined in the auth.js
  verifyUser(req, (err, user) => {
    // "error-first" function
    if (err) {
      // if there is a problem verifying you
      res.send('invalid token');
    } else {
      // if there is not a problem verifying you
      res.send(user);
    }
  })
}

async function handlePostScores(request, response) {
  // take score and pass to mongo
  console.log(request.body)
  try {
      let queryObj = {};
      if (request.body.score) {
          queryObj = { score: request.body.score,
          email: request.body.email }
          
      }
      let newScore = await scoreModel.create(queryObj)


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


async function handleGetScores(request, response) {
    // if (this.props.auth0.isAuthenticated) {
    //   const res = await this.props.auth0.getIdTokenClaims();
    //   const jwt = res.__raw;
    //   console.log("jwt: ", jwt);
    //   const config = {
    //     headers: { "Authorization": `Bearer ${jwt}` },
    //     method: 'get',
    //     baseURL: process.env.REACT_APP_SERVER,
    //     url: '/score'
    //   }
    // let apiUrl = `${SERVER}/books`;

    // console.log(apiUrl);
//     const HighScores = await mongoose.db.triva.find( {} );
//     this.setState({ score: HighScores });
//     console.log();
//   }
try {
let queryObj = {};
    if (request.query.email) {
      queryObj = { email: request.query.email }
    }
    let scoresFromDB = await scoreModel.find((queryObj));

    if (scoresFromDB) {
      response.status(200).send(scoresFromDB);
    } else {
      response.status(404).send('no scores for you!');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('server error');
  }
} 


  async function handleDeleteScores(request, response) {
    const id = request.params.id;
    const email = request.query.email;
    try {
      const score = await scoreModel.findOne({ _id: id, email: email });
    console.log(score);
    if (!score) {
      response.status(400).send('unable to delete score');
      return;
    }

    if (score.email !== email) {
      response.status(400).send('unable to delete score');
      return;
    }
      await scoreModel.findByIdAndDelete(id);
      response.status(200).send('This score has been Removed!')
    } catch (error) {
      console.log(error);
      res.status(404).send('unable to delete score');
    }

  }
    // const config = {
    //   params: { email: this.props.user.email },
    //   method: 'delete',
    //   baseURL: `${SERVER}`,
    //   url: `/score/${id}`
    // }
    // await axios(config);
    // console.log(config);



  async function handleUpdateScores(request, response) {
    // console.log('score', updateScoreId);
    // const id = updateScoreId._id;
    // let updateScores = this.state.score;
    // console.log(updateScores);
    // updateScores = this.state.score.map(currentBook => currentBook._id === updateScoreId._id ? updateScores : currentBook );
    // this.setState({ books: updateScores });
    // console.log(id);
    // const config = {
    //   params: { email: this.props.user.email },
    //   data: {score: updateScoreId.score},
    //   method: 'put',
    //   baseURL: `${SERVER}`,
    //   url: `/score/${id}`
    // }
    // let res = await axios(config);
    // console.log(res);

  //   this.handleGetScores();
  // }

  try {
    const id = request.params.id;
    const email = request.query.email;

    const scoreUpdate = await scoreModel.findOne({ _id: id, email: email })

    if (!scoreUpdate) {
      response.status(404).send('no scores for you!');
      return;
    }
    if (scoreUpdate.email !== email) {
      response.status(400).send('unable to update score');
      return;
    }
    const updatedscore = await scoreModel.findByIdAndUpdate(id, request.body, { new: true});
    response.send(updatedscore)

  }
  catch (error) {
    console.error(error);
    response.status(500).send('We have a problem');
  }
}


app.listen(PORT, () => console.log(`listening on ${PORT}`));