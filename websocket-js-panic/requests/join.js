const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

module.exports = function join(response){
    const playerId = response.playerId;
    const gameId = response.gameId;
    const name = response.name;

    const game = games[gameId];

    if(!game){
        //If the game does not exists do nothing...
        //TODO: Send something back for error showing in frontend!
        return;
    }

    if (game.players.length >= 10){
        //TODO: send back something
        //max players reached
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
