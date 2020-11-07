const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

module.exports = function start(response){
    const gameId = response.gameId;
    const game = games[gameId];

    const payLoad = {
        "method": "start",
        "game": game
    };

    game.players.forEach(c => {
        players[c.playerId].connection.send(JSON.stringify(payLoad));
    });
}
