const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const searchObjectInArray = require('../methods/searchObjectInArray');

//TODO: Set timeout for choosig phase in case of AFK players...
module.exports = function choose(response){
    const playerId = response.playerId;
    const gameId = response.gameId;
    const card = response.card;

    const timestamp = new Date();
    const game = games[gameId];
    const player = searchObjectInArray(playerId, "playerId", game.players);

    player.choice = {
        "card" : card,
        "timestamp": timestamp
    };

    const payLoad = {
        "method": "choose",
        "playerInfo": player
    };

    game.players.forEach(c => {
        players[c.playerId].connection.send(JSON.stringify(payLoad));
    });

    //Check if all players have chosen card
    var count = 0;
    game.players.forEach(c => {
        if(c.choice){
            count++;
        }
    });

    if (count == game.players.length){
        //console.log("All players have chosen");
        findWinner(game);
    }
}

function findWinner(game){
    //TODO: find a winner

    //Till the find function is not ready, the winner is specified randomly
    const winner = game.players[Math.floor(Math.random() * game.players.length)];

    //Updating the game for the next round
    winner.tokens++;
    game.master = winner.playerId;

    const payLoad = {
        "method": "winner",
        "winner": winner
    };
    game.players.forEach(c => {
        players[c.playerId].connection.send(JSON.stringify(payLoad));
    });

    game.players.forEach(c => {
        delete c.choice;
    });
}
