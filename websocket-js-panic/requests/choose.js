const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;
const players = hashmaps.players;

const searchObjectInArray = require('../methods/searchObjectInArray');
const searchCard = require('../methods/searchCard');
const shuffleArray = require('../methods/shuffleArray');
const init_board = require('../board/init_board.json');

//TODO: Set timeout for choosig phase in case of AFK players...
module.exports = function choose(response){
    const playerId = response.playerId;
    const gameId = response.gameId;
    const card = response.card;

    const timestamp = new Date();
    const game = games[gameId];
    const player = searchObjectInArray(playerId, "playerId", game.players);

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

    //Check if all players have chosen card
    var count = 0;
    game.players.forEach(c => {
        if(c.choice){
            count++;
        }
    });
    if (count == game.players.length){
        //console.log("All players have chosen");
        findRoundWinner(game);
    }
}

function findRoundWinner(game){

    var winner = null;

    //Getting the card index
    let board = [...init_board];
    shuffleArray(board, game.boardSeed);
    var cardIndex = searchCard(board, game.dices);
    //console.log(game.dices);
    console.log(cardIndex);

    var playersWhoGotItRight = [];

    game.players.forEach(c => {
        if(cardIndex == c.choice.card){
            playersWhoGotItRight.push(c);
        }
    });

    //TODO: if more players chosen the right card, compare the timestamps
    if(playersWhoGotItRight.length == 1){
        winner = playersWhoGotItRight[0];
        winner.tokens++;
    }

    const payLoad = {
        "method": "winner",
        "winner": winner
    };
    game.players.forEach(c => {
        players[c.playerId].connection.send(JSON.stringify(payLoad));
    });


    //Broadcasting the final result of the game as a list
    if (game.round === game.noRounds){
        const payLoad = {
            "method": "result",
            "result": game.players.sort(compare)
        };
        game.players.forEach(c => {
            players[c.playerId].connection.send(JSON.stringify(payLoad));
        });
    }
    else {
        //Updating the game for the next round
        winner ? game.master = winner.playerId : null;
        game.round++;
        game.players.forEach(c => {
            delete c.choice;
        });
        game.dices = {
            "shape": null,
            "texture": null,
            "color": null,
            "generator": null
        };
    }
}

//For sorting in descending order by token number
function compare(a, b) {
    if (a.tokens < b.tokens){
      return 1;
    }
    if (a.tokens > b.tokens){
      return -1;
    }
    return 0;
}
