const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const error = require('../methods/error');
const searchObjectInArray = require('../methods/searchObjectInArray');

module.exports = function join(response){
    const playerId = response.playerId;
    const gameId = response.gameId;
    const name = response.name;

    const game = games[gameId];

    if(!game){
        error(playerId, "The game: " + gameId + " does not exists!" );
        return;
    }
    if (game.players.length >= 10){
        error(playerId, "The room: " + gameId + " is full!" );
        return;
    }
    //Check if the player is already in the room
    if (searchObjectInArray(playerId, "playerId", game.players)){
        error(playerId, "You are already connected to this room!");
        return;
    }

    game.players.push({
        "playerId": playerId,
        "tokens": 0,
        "name": name
    });

    const payLoad = {
        "method": "join",
        "players": game.players
    };

    //broadcast player infos to all players
    //(waiting room)
    game.players.forEach(p => {
        players[p.playerId].connection.send(JSON.stringify(payLoad))
    });
}
