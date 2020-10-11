const express = require('express');
const router = express.Router();

const Round = require('../models/Round');
const Choice = require('../models/Choice');

//Post a new round
router.post('/', async (req, res) => {
    const round = new Round({
        master: req.body.master,
        roomID: req.body.roomID
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
router.get('/choices/:roundID', async (req, res) =>{
    try{
        const choices = await Choice.find({roundID: req.params.roundID});
        res.json(choices);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;
