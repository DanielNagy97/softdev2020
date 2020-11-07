const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

module.exports = function roll(response){
    const playerId = response.playerId;
    const gameId = response.gameId;

    const game = games[gameId];

    if(game.master !== playerId){
        //invaild roll, it is not the master
        //TODO: send something back
        return;
    }
    game.dices.shape = {
                        "0": "Snail",
                        "1": "Gost"
                    }[Math.round(Math.random())];
    game.dices.texture = {
                        "0": "Striped",
                        "1": "Dotted"
                    }[Math.round(Math.random())];
    game.dices.color = {
                        "0": "Blue",
                        "1": "Orange"
                    }[Math.round(Math.random())];
    game.dices.generator = {
                            "0": "Red,White",
                            "1": "Red,Black",
                            "2": "Blue,White",
                            "3": "Blue,Black",
                            "4": "Yellow,White",
                            "5": "Yellow,Black"
                        }[Math.floor(Math.random() * 6)];

    const payLoad = {
        "method": "roll",
        "dices": game.dices
    };

    game.players.forEach(c => {
        players[c.playerId].connection.send(JSON.stringify(payLoad));
    });
}
