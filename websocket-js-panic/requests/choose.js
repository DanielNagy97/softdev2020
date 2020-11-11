const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const error = require('../methods/error');

const searchObjectInArray = require('../methods/searchObjectInArray');
const findRoundWinner = require('../methods/findRoundWinner');

//TODO: Set timeout for choosig phase in case of AFK players...
module.exports = function choose(response){
    //Using server time for the timestamp to avoid client cheating!
    const timestamp = new Date();
    const playerId = response.playerId;
    const gameId = response.gameId;
    const card = response.card;
    const game = games.get(gameId);

    if(!game){
        error(playerId, "The game: " + gameId + " does not exists!" );
        return;
    }
    //Check if the player is in the room
    if (!searchObjectInArray(playerId, "playerId", game.players)){
        error(playerId, "You are not connected to the room: " + gameId + " !");
        return;
    }
    if (!game.dices.shape){
        error(playerId, "You cannot choose the card, the dices are not rolled yet!");
        return;
    }

    const player = searchObjectInArray(playerId, "playerId", game.players);

    //The players can only choose once per round!
    if (player.choice){
        error(playerId, "You have already chosen a card!");
        return;
    }

    player.choice = {
        "card" : card,
        "timestamp": timestamp
    };

    const payLoad = {
        "method": "choose",
        "playerInfo": player
    };

    //Broadcasting the player's choice for the other players
    game.players.forEach(p => {
        players.get(p.playerId).connection.send(JSON.stringify(payLoad));
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
