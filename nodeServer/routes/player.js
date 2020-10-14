const express = require('express');
const router = express.Router();

const Player = require('../models/Player');

//Post a new player
router.post('/', async (req, res) => {

    let player = await Player.findOne({ name: req.body.name});

    if (player) {
        return res.status(400).send('The name: '+req.body.name+' is already taken!');
    } else {
        
        player = new Player({
            name: req.body.name,
            avatar: req.body.avatar,
            score: 0,
            roomID: req.body.roomID
        });
        
        try{
        const savePlayer = await player.save();
        res.json(savePlayer);
        }catch(err){
            res.json({message: err});
        }
    }
});

//Get players list
router.get('/', async (req, res) => {
    try{
        const players = await Player.find();
        res.json(players);
    }catch(err){
        res.json({message: err});
    }
});

//Get player by ID
router.get('/:playerID', async (req, res) =>{
    try{
        const player = await Player.findById(req.params.playerID);
        res.json(player);
    }catch(err){
        res.json({message: err});
    }
});


//Update name and avatar
router.patch('/:playerID', async (req, res) =>{
    try{
        const updatedPlayer = await Player.updateOne({_id: req.params.playerID},
            {$set: {
                name: req.body.name,
                avatar: req.body.avatar,
            }
        });
        res.json(updatedPlayer);
    }catch(err){
        res.json({message: err});
    }
});

//Delete player
router.delete('/:playerID', async (req, res) =>{
    try{
        const removedPlayer = await Player.deleteOne({_id: req.params.playerID});
        res.json(removedPlayer);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;
