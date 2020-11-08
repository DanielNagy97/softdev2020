const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const searchObjectInArray = require('../methods/searchObjectInArray');
const findRoundWinner = require('../methods/findRoundWinner');

//TODO: Set timeout for choosig phase in case of AFK players...
module.exports = function choose(response){
    const timestamp = new Date();
    const playerId = response.playerId;
    const gameId = response.gameId;
    const card = response.card;
    const game = games[gameId];
    if(!game){
        //If the game does not exists do nothing...
        //TODO: Send something back for error showing in frontend!
        return;
    }

    if (!game.dices.shape){
        //You cannot choose the card if there is no dices in the round
        //TODO: Send something back for error showing in frontend!
        return;
    }

    const player = searchObjectInArray(playerId, "playerId", game.players);

    player.choice = {
        "card" : card,
        "timestamp": timestamp
    };

    const payLoad = {
        "method": "choose",
        "playerInfo": player
    };

    game.players.forEach(p => {
        players[p.playerId].connection.send(JSON.stringify(payLoad));
    });

    //Check if all players have chosen card
    var count = 0;
    game.players.forEach(p => {
        if(p.choice){
            count++;
        }
    });
    //Then find the winner of the round
    if (count == game.players.length){
        findRoundWinner(game, players);
    }
}
