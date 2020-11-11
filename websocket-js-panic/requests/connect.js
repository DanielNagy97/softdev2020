const hashmaps = require('../hashmaps/hashmaps');
const players = hashmaps.players;

const guid = require('../methods/guid');
 
module.exports = function connect(connection){
//generate new playerId
    const playerId = guid();

    //update the hash
    //TODO: give players names (by registration or something...)
    players.set(playerId, {
        "connection": connection
    });

    const payLoad = {
        "method": "connect",
        "playerId": playerId
    };
    connection.send(JSON.stringify(payLoad));
}
