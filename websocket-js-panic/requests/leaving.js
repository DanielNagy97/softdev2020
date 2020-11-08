const hashmaps = require('../hashmaps/hashmaps');
const players = hashmaps.players;

module.exports = function leaving(playerId){
    //delete player from hash
    delete players[playerId];
}
