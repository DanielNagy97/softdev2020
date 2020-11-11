const hashmaps = require('../hashmaps/hashmaps');
const games = hashmaps.games;

const searchCard = require('../methods/searchCard');
const shuffleArray = require('../methods/shuffleArray');
const init_board = require('../board/init_board.json');

module.exports = function findRoundWinner(game, players){
    var winner = null;

    //Getting the card index
    let board = [...init_board];
    shuffleArray(board, game.boardSeed);
    var cardIndex = searchCard(board, game.dices);
    //console.log(cardIndex);

    var playersWhoGotItRight = [];

    game.players.forEach(c => {
        if(cardIndex == c.choice.card){
            playersWhoGotItRight.push(c);
        }
        else{
            //For the wrong choice, the players must pay one token!
            if(c.tokens != 0){
                c.tokens--;
                game.noTokens++;
            }
        }
    });

    if(playersWhoGotItRight.length == 1){
        winner = playersWhoGotItRight[0];
        winner.tokens++;
        game.noTokens--;
    }
    else if(playersWhoGotItRight.length > 1){
        //find minimum timestamp
        winner = playersWhoGotItRight[0];
        playersWhoGotItRight.forEach(p => {
            if(p.choice.timestamp < winner.choice.timestamp){
                winner = p;
            }
        });
        winner.tokens++;
        game.noTokens--;
    }

    //If there is no winner, send back the cardIndex
    const payLoad = {
        "method": "winner",
        "winner": winner ? winner : cardIndex
    };
    game.players.forEach(p => {
        players[p.playerId].connection.send(JSON.stringify(payLoad));
    });
    

    //Broadcasting the final result of the game as a list
    if (game.round === game.noRounds | game.noTokens == 0){
        const payLoad = {
            "method": "result",
            "result": game.players.sort(compareTokens)
        };
        game.players.forEach(p => {
            players[p.playerId].connection.send(JSON.stringify(payLoad));
        });

        //Then deleting the game, because it is no longer needed!
        delete games[game.id];
    }
    else {
        //Updating the game for the next round
        winner ? game.master = winner.playerId : null;
        game.round++;
        game.players.forEach(p => {
            delete p.choice;
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
function compareTokens(a, b) {
    if (a.tokens < b.tokens){
      return 1;
    }
    if (a.tokens > b.tokens){
      return -1;
    }
    return 0;
}
