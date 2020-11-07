const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const guid = require('../methods/guid');

module.exports = function create(response){
    const playerId = response.playerId;
    const gameId = guid();
    const boardSeed =  Math.floor(Math.random() * 10001) + 1;
    
    games[gameId] = {
        "id": gameId,
        "master": playerId,
        "boardSeed": boardSeed,
        "players": [],
        "dices": {
            "shape": null,
            "texture": null,
            "color": null,
            "generator": null
        },
        "round": 1,
        "winner": null
    };
    
    const payLoad = {
        "method": "create",
        "game": games[gameId]
    };
    
    const connection = players[playerId].connection;
    connection.send(JSON.stringify(payLoad));
}
