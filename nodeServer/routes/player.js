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
            score: 0
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
router.get('/:playerId', async (req, res) =>{
    try{
        const player = await Player.findById(req.params.playerId);
        res.json(player);
    }catch(err){
        res.json({message: err});
    }
});

//Get players with scores
//TODO: Get this working!
router.get('/scores', async (req, res) => {
    try{
        let players = await Player.find({},'name score');
        res.json(players);
    }catch(err){
        res.json({message: err});
    }
});

//Update name and avatar
router.patch('/:playerId', async (req, res) =>{
    const originalPlayer = await Player.findById(req.params.playerId);
    try{
        const updatedPlayer = await Player.updateOne({_id: req.params.playerId},
            {$set: {
                name: req.body.name,
                avatar: req.body.avatar,
                score: originalPlayer.score
            }
        });
        res.json(updatedPlayer);
    }catch(err){
        res.json({message: err});
    }
});

//Delete player
router.delete('/:playerId', async (req, res) =>{
    try{
        const removedPlayer = await Player.deleteOne({_id: req.params.playerId});
        res.json(removedPlayer);
    }catch(err){
        res.json({message: err});
    }
});

/*
Populate
        const album = await Album.find({postedBy: req.params.userId})
        .populate('artist', ['name', 'country'])
        .populate('postedBy', ['name', 'email']);

*/

module.exports = router;
