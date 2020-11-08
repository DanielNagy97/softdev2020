const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

module.exports = function start(response){
    const gameId = response.gameId;
    const game = games[gameId];
    if(!game){
        //If the game does not exists do nothing...
        //TODO: Send something back for error showing in frontend!
        return;
    }

    const payLoad = {
        "method": "start",
        "game": game
    };

    game.players.forEach(p => {
        players[p.playerId].connection.send(JSON.stringify(payLoad));
    });
}
