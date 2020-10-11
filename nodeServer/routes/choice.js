const express = require('express');
const router = express.Router();

const Choice = require('../models/Choice');

//Post a new choice
router.post('/', async (req, res) => {
    const choice = new Choice({
        playerID: req.body.playerID,
        roundID: req.body.roundID,
        choice: req.body.choice
    });
    try{
        const saveChoice = await choice.save();
        res.json(saveChoice);
    }catch(err){
        res.json({message: err});
    }
});

//Get choices list
router.get('/', async (req, res) => {
    try{
        const choices = await Choice.find();
        res.json(choices);
    }catch(err){
        res.json({message: err});
    }
});

//Get choice by ID
router.get('/:choiceID', async (req, res) =>{
    try{
        const choice = await Choice.findById(req.params.choiceID);
        res.json(choice);
    }catch(err){
        res.json({message: err});
    }
});

//Get choices by roundID
router.get('/round/:roundID', async (req, res) =>{
    try{
        const choices = await Choice.find({roundID: req.params.roundID});
        res.json(choices);
    }catch(err){
        res.json({message: err});
    }
});


module.exports = router;
