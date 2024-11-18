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
    let gameState = activeSessions[sessionID];

    if (!sessionID) {
        res.status(400);
        res.send({ error: "Session ID is required" });
        return;
    }
    if (!gameState) {
        res.status(404);
        res.send({ error: "Session ID does not match any active session" });
        return;
    } 

    res.send({gameState: activeSessions[sessionID]});
    res.status(200);
});

server.post('/guess', (req, res) => {
    let sessionID = req.body.sessionID;
    let guess = (req.body.guess || "").toLowerCase();
    let gameState = activeSessions[sessionID];

        if (!sessionID) {
            res.status(400);
            res.send({ error: "Session ID is required" });
            return;
        }
        if (!gameState) {
            res.status(404);
            res.send({ error: "Session not found" });
            return;
        }
        if (guess.length !== 5) {
            res.status(400);
            res.send({ error: "Guess must be exactly 5 characters long" });
            return;
        }
        if (!/^[a-z]+$/.test(guess)) {
            res.status(400);
            res.send({ error: "Guess must contain only letters" });
            return;
        } 
        if (gameState.gameOver) {
            res.status(400);
            res.send({ error: "Game is already over" });
            return;
        }

    let answer = gameState.wordToGuess;
    let guessResult = [];

    for (let i = 0; i < guess.length; i++) {
        let letter = guess[i];
        let result;

        if (letter === answer[i]) {
            result = 'RIGHT';

            if (!gameState.rightLetters.includes(letter)) {
                gameState.rightLetters.push(letter);
            }
            gameState.closeLetters = gameState.closeLetters.filter((l) => l !== letter);
        } else if (answer.includes(letter)) {
            result = 'CLOSE';

            if (!gameState.rightLetters.includes(letter) && !gameState.closeLetters.includes(letter)) {
                gameState.closeLetters.push(letter);
            }
        } else {
            result = 'WRONG';

            if (!gameState.wrongLetters.includes(letter)) {
                gameState.wrongLetters.push(letter);
            }
        }
        guessResult.push({ value: letter, result });
    }
    gameState.guesses.push(guessResult);

    gameState.remainingGuesses -= 1;
    gameState.gameOver = gameState.remainingGuesses <= 0 ||
                         guessResult.every(item => item.result === 'RIGHT');

    let response = { gameState };

    if (gameState.gameOver) {
        response.wordToGuess = answer;
    }

    res.status(201)
    res.send(response);
});

server.delete('/reset', (req, res) => {
    let sessionID = req.query.sessionID;
 
    if (!sessionID) {
        res.status(400);
        res.send({ error: "Session ID is required" });
        return;
    }
 
    let gameState = activeSessions[sessionID];
    if (!gameState) {
        res.status(404);
        res.send({ error: "Session not found" });
        return;
    }
 
    activeSessions[sessionID] = {
        wordToGuess: undefined,
        guesses: [],
        wrongLetters: [],
        closeLetters: [],
        rightLetters: [],
        remainingGuesses: 6,
        gameOver: false
    };
 
    res.status(200).send({ gameState: activeSessions[sessionID] });
 });

 server.delete('/delete', (req, res) => {
    let sessionID = req.query.sessionID;
 
    if (!sessionID) {
        res.status(400).send({ error: "Session ID is required" });
        return;
    }
 
    if (!activeSessions[sessionID]) {
        res.status(404).send({ error: "Session not found" });
        return;
    }
 
    delete activeSessions[sessionID];

    res.status(204).send();
 });
 
 

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;


