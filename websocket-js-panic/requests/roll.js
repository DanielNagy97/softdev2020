const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

//for debugging
const searchCard = require('../methods/searchCard');
const shuffleArray = require('../methods/shuffleArray');
const init_board = require('../board/init_board.json');

module.exports = function roll(response){
    const playerId = response.playerId;
    const gameId = response.gameId;

    const game = games[gameId];

    if(!game){
        //If the game does not exists do nothing...
        //TODO: Send something back for error showing in frontend!
        return;
    }
    if(game.players.length == 0){
        //If the game does not have any players do nothing...
        //TODO: Send something back for error showing in frontend!
        return;
    }
    if(game.master !== playerId){
        //invaild roll, the player is not the master
        //TODO: Send something back for error showing in frontend!
        return;
    }
    game.dices.shape = {
                        "0": "Snail",
                        "1": "Gost"
                    }[Math.round(Math.random())];
    game.dices.texture = {
                        "0": "Striped",
                        "1": "Dotted"
                    }[Math.round(Math.random())];
    game.dices.color = {
                        "0": "Blue",
                        "1": "Orange"
                    }[Math.round(Math.random())];
    game.dices.generator = {};
    game.dices.generator.color = {
                            "0": "Red",
                            "1": "Blue",
                            "2": "Yellow"
                        }[Math.floor(Math.random() * 3)];
    game.dices.generator.way = {
                            "0": "White",
                            "1": "Black",
                        }[Math.round(Math.random())];


    const payLoad = {
        "method": "roll",
        "dices": game.dices
    };

    //For debugging --------------------
    //For seeing the result before the choosing
    let board = [...init_board];
    shuffleArray(board, game.boardSeed);
    var cardIndex = searchCard(board, game.dices);
    console.log(cardIndex);
    //For debugging --------------------


    game.players.forEach(p => {
        players[p.playerId].connection.send(JSON.stringify(payLoad));
    });
}
