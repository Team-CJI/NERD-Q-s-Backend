const axios = require('axios');
let cache = require('./cache.js');

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

async function getVideoGames(request, response) {
    // const key = 'videoGame-' + searchQuery;
    // const searchQuery = request.query.searchQuery;
    // if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    //     console.log('videoGame:', 'Cache hit');
    // } else {
        // cache[key] = {};
        // cache[key].timestamp = Date.now();
        console.log('videoGame:', 'Cache miss!');
        console.log(response.data);
        data = `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy`;
        let videoGamesResponse = await axios({
            method: 'get',
            url: data,
        });
        try {
            console.log(videoGamesResponse.data.results);
            const videoGameArr = videoGamesResponse.data.results.map(videoGame => {
                return new videoGame(videoGame);
            });
            console.log(videoGameArr);
            response.status(200).send(videoGameArr);
            return Promise.resolve(videoGameArr);
        } catch (e) {
            return Promise.reject(e);
        }
    }


//   } catch (error) {
//     response.status(503).send('videoGames not found');
//   }
// }

module.exports = {
    getVideoGames: getVideoGames
};