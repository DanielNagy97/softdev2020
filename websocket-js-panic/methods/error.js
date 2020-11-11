const hashmaps = require('../hashmaps/hashmaps');
const players = hashmaps.players;

//Sending error messages to a player
module.exports = function error(playerId, errorMsg){

    const payLoad = {
        "method": "error",
        "errorMsg": errorMsg
    };
    const connection = players[playerId].connection;
    connection.send(JSON.stringify(payLoad));
}
