const express = require("express");
const uuid = require("uuid");
const server = express();
server.use(express.json());
server.use(express.static('public'));

//All your code goes here
let activeSessions={}

server.get('/newgame', (req,res)=>{
    let newID = uuid.v4();
    let answer = (req.query.answer || "apple").toLowerCase();  
    let newGame ={
        wordToGuess: answer,
        guesses:[],
        wrongLetters:[],
        closeLetters:[],
        rightLetters:[],
        remainingGuesses:6,
        gameOver: false
    };

    activeSessions[newID] = newGame;
    res.status(201);
    res.send({sessionID: newID});
})

server.get('/gamestate', (req,res) => {
    let sessionID = req.query.sessionID;

    res.send({gameState: activeSessions[sessionID]});
    res.status(200);
});

server.post('/guess', (req, res) => {
    let sessionID = req.body.sessionID;
    let guess = (req.body.guess || "").toLowerCase();
    let gameState = activeSessions[sessionID];
    let answer = gameState.wordToGuess;
    let wrongLetters = [];
    let closeLetters = [];
    let rightLetters = [];

    gameState.guesses.push(guess);
    gameState.remainingGuesses -= 1;

    for (let i = 0; i < guess.length; i++) {
        let letter = guess[i];
        if (letter === answer[i]) {
            rightLetters.push(letter);
        } else {
            let isClose = false;
            for (let index = 0; index < answer.length; index++) {
                if (letter === answer[index]) {
                    isClose = true;
                    break;
                }
            }
            if (isClose) {
                closeLetters.push(letter);
            } else {
                wrongLetters.push(letter);
            }
        }
    }

    gameState.wrongLetters = wrongLetters;
    gameState.closeLetters = closeLetters;
    gameState.rightLetters = rightLetters;

    let response = {gameState};
    
    if (gameState.gameOver) {
        response.wordToGuess = answer;
    }

    res.status(201)
    res.send(response);
});

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;
