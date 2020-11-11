const hashmaps = require('../hashmaps/hashmaps');
const players = hashmaps.players;
const games = hashmaps.games;

module.exports = function leaving(playerId){
    //TODO: 
    /*
    const gameId = players.get(playerId).gameId;

    //delete player from its actual game
    if(gameId){
        const playersOfTheGame = games.get(gameId).players;
        const indexOfPlayer = searchObjectInArrayIndex(playerId, "playerId", playersOfTheGame);
        playersOfTheGame.splice(indexOfPlayer, 1);

        //check if game has any players left after leaving!
        if(games.get(gameId).players.length == 0){
            games.delete(gameId);
        }
    }

    //delete player from hash
    players.delete(playerId);
    */
}


function searchObjectInArrayIndex(value, key, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][key] === value) {
            return i;
        }
    }
    return null;
}
