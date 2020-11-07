const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

module.exports = function join(response){
    const playerId = response.playerId;
    const gameId = response.gameId;

    const game = games[gameId];

    if (game.players.length >= 10){
        //TODO: send back something
        //max players reached
        return;
    }

    game.players.push({
        "playerId": playerId,
        "tokens": 0
    });

    const payLoad = {
        "method": "join",
        "players": game.players
    };

    //broadcast player infos to all players
    //(waiting room)
    game.players.forEach(c => {
        players[c.playerId].connection.send(JSON.stringify(payLoad))
    });
}
