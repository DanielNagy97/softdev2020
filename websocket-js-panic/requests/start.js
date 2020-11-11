const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const error = require('../methods/error');

module.exports = function start(response){
    const playerId = response.playerId;
    const gameId = response.gameId;
    const game = games.get(gameId);
    if(!game){
        error(playerId, "The game: " + gameId + " does not exists!" );
        return;
    }
    if(game.players.length == 0){
        error(playerId, "Nobody has connected to this games!" );
        return;
    }

    const payLoad = {
        "method": "start",
        "game": game
    };

    game.players.forEach(p => {
        players.get(p.playerId).connection.send(JSON.stringify(payLoad));
    });
}
