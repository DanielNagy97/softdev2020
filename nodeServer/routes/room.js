const express = require('express');
const router = express.Router();

const Room = require('../models/Room');
const Round = require('../models/Round');
const Choice = require('../models/Choice');
const Player = require('../models/Player');

//Post a new room
router.post('/', async (req, res) => {
    let roomID;
    let room = false;

    //generating room number
    while(room != null){
        roomID = Math.floor(Math.random() * (99999 - 10000) ) + 10000;
        room = await Room.findOne({ _id: roomID });
    }
    room = new Room({
        _id: roomID,
        //generating seed for room
        boardSeed: Math.floor(Math.random() * 10001) + 1
    });
        
    try{
        const saveRoom = await room.save();
        res.json(saveRoom);
    }catch(err){
        res.json({message: err});
    }
});

//Get rooms list
router.get('/', async (req, res) => {
    try{
        const rooms = await Room.find();
        res.json(rooms);
    }catch(err){
        res.json({message: err});
    }
});

//Get players by roomID
router.get('/:roomID/players', async (req, res) =>{
    try{
        const players = await Player.find({roomID: req.params.roomID});
        res.json(players);
    }catch(err){
        res.json({message: err});
    }
});

//Get rounds by roomID
router.get('/:roomID/rounds', async (req, res) =>{
    try{
        let rounds = await Round.find({roomID: req.params.roomID});
        res.json(rounds);
    }catch(err){
        res.json({message: err});
    }
});

//Get round with choices by roundID


module.exports = router;
