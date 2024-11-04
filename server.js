const express = require("express");
const uuid = require("uuid");
const server = express();
server.use(express.json());
server.use(express.static('public'));

//All your code goes here
let activeSessions={}

server.get('/newgame', (req,res)=>{
    let newID = uuid.v4();
    let answer = (req.query.answer || "hello").toLowerCase();  
    let newGame ={
        wordToGuess: answer,
        guesses:[],
        wrongLetters:[],
        
        closeLetters:[],
        rightLetters:[],
        remainingGuesses:6,
        gameOver: false
    };

  let guess = (req.query.guess || null)?.toLowerCase();

    if (guess === answer){
        newGame.gameOver = true;
    } else if (guess){
        newGame.guesses.push(guess);
        newGame.remainingGuesses -= 1;
        
        if(newGame.remainingGuesses === 0){
            newGame.gameOver = true;
        }
    }

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

    if (sessionID || guess){
        res.status(404)
        res.send({error: "Session ID/guess are required"})
    }
    
    res.status(201);
}

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;
