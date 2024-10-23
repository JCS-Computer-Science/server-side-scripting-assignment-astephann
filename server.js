const express = require("express");
const uuid = require("uuid");
const server = express();
server.use(express.json());
server.use(express.static('public'));
//All your code goes here
let activeSessions={}

server.get('/newgame', (req,res)=>{
    let newID = uuid.v4();
    let newGame ={
        wordToGuess: "apple",
        guesses:[],
        wrongLetters:[],
        closeLetters:[],
        rightLetters:[],
        remainingGuesses:6,
        gameOver: false
    }
    activeSessions[newID] = newGame
    res.status(201)
    res.send({sessionID: newID})
})
server.get('/gamestate', (req,res)=>){
    const sessionID = req.query.sessionID;

    if (sessionID === 'undefined'){
        
    }
    res.status
}

// server.get('/gamestate', (req,res)=>{
//     let sessionID = req.query.sessionID;

//     if (!sessionID){
//         res.status(400);
//         return res.send({error: "No session ID providied"});
//     }
//     let gamestate = activeSessions[sessionID];
//     if (!gamestate) {
//         res.status(404);
//         return res.send({error: "Game session not found"})
//     }
//     let responseState = {...gamestate};
//     if (!gamestate.gameOver){
//         wordToGuess = "undefined";
//     }

//     res.status(200);
//     res.send({sessionID})
// })


//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;
