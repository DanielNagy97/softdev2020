const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const searchObjectInArray = require('../methods/searchObjectInArray');

module.exports = function choose(response){
    const playerId = response.playerId;
    const gameId = response.gameId;
    const card = response.card;

    const timestamp = new Date();
    const game = games[gameId];
    const player = searchObjectInArray(playerId, "playerId", game.players)

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
}
