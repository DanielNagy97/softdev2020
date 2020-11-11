const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const error = require('../methods/error');

/*
//for debugging
const searchCard = require('../methods/searchCard');
const shuffleArray = require('../methods/shuffleArray');
const init_board = require('../board/init_board.json');
*/

module.exports = function roll(response){
    const playerId = response.playerId;
    const gameId = response.gameId;

    const game = games[gameId];

    if(!game){
        error(playerId, "The game: " + gameId + " does not exists!" );
        return;
    }
    if(game.master !== playerId){
        error(playerId, "Invaild roll! You are not the master of the round!" );
        return;
    }
    if(game.players.length == 0){
        error(playerId, "You can not roll if there is nobody in the room!" );
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

/*
    //For debugging --------------------
    //For seeing the result before the choosing
    let board = [...init_board];
    shuffleArray(board, game.boardSeed);
    var cardIndex = searchCard(board, game.dices);
    console.log(cardIndex);
    //For debugging --------------------
*/

    game.players.forEach(p => {
        players[p.playerId].connection.send(JSON.stringify(payLoad));
    });
}
