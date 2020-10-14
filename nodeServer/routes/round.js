const express = require('express');
const router = express.Router();

const Round = require('../models/Round');
const Choice = require('../models/Choice');

//Post a new round

//PROBLEM: Dices are lost. The Schema can be wrong
//TODO: Get this working!
router.post('/', async (req, res) => {

    //TODO: Check if player in the room exists!!!

    const round = new Round({
        master: req.body.master,
        roomID: req.body.roomID,
        dices : {
            shape : undefined,
            color : undefined,
            texture : undefined,
            direction : undefined
        }
    });
        
    try{
        const saveRound = await round.save();
        res.json(saveRound);
    }catch(err){
        res.json({message: err});
    }
});

//Get rounds list
router.get('/', async (req, res) => {
    try{
        const rounds = await Round.find()
        .populate('master', ['name', 'score']);
        res.json(rounds);
    }catch(err){
        res.json({message: err});
    }
});

//Get a round by ID
router.get('/:roundID', async (req, res) =>{
    try{
        const round = await Round.findById(req.params.roundID)
        .populate('master', ['name', 'score']);
        res.json(round);
    }catch(err){
        res.json({message: err});
    }
});

//Get choices by roundID
router.get('/:roundID/choices', async (req, res) =>{
    try{
        const choices = await Choice.find({roundID: req.params.roundID});
        res.json(choices);
    }catch(err){
        res.json({message: err});
    }
});

//Update dices
router.patch('/:roundID/roll', async (req, res) =>{
    try{
        const updatedRound = await Round.updateOne({master: req.body.master},
            {$set: {
                dices : req.body.dices
            }
        });
        res.json(updatedRound);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;
