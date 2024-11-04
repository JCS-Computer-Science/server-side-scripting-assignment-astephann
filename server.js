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

server.post('/guess'), (req,res)=>{
    let sessionID = req.body.sessionID;
    let guess = req.body.guess;
    let gameState = activeSession[sessionID];

    if (!sessionID || !guess){
        res.status(404);
        res.send({error: "Session ID/guess are required"});
    }

    if (guess.length !== 5){
        res.status(400);
        res.send({error: "guess must be 5 characters"});
    }
    
    if (!gameState){
        res.status(404);
        res.send({error:"Session not found"});
    }

    if(gameState.gameOver === true){
        res.status(400);
        res.send({error: "Game is over"});
    }



    
    res.status(201);
}

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;
