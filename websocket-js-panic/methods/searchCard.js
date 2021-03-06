
module.exports = function searchCard(board, dices){
    //copying the dices object
    let dice = { ...dices };

    if(dice.generator.way == "Black"){
        //Reversing the board because of the generator way
        board.reverse();

        //Get the index of generator
        var generatorIndex;
        board.forEach((c, index) => {
            if(c.type == "Generator" && c.color == dice.generator.color){
                generatorIndex = index;
            }
        });

        //Determining Vents jump_tos
        calcVentsJumpTos(board);

        //Searching the card according to the dices
        let cardIndex = lookUpBoard(generatorIndex, board, dice);
        cardIndex = 24-cardIndex;
        return cardIndex;
    }
    else if(dice.generator.way == "White"){
        //Get the index of generator
        var generatorIndex;
        board.forEach((c, index) => {
            if(c.type == "Generator" && c.color == dice.generator.color){
                generatorIndex = index;
            }
        });

        //Determining Vents jump_tos
        calcVentsJumpTos(board);

        //Searching the card according to the dices
        let cardIndex = lookUpBoard(generatorIndex, board, dice);
        return cardIndex;
    }
}

function lookUpBoard(generatorIndex, board, dice){
    let i = generatorIndex;
    let cardIndex = null;
    while (!cardIndex) {
        //console.log(i);
        if(board[i].type == "Vent"){
            i = board[i].jump_to;
        }
        else if(board[i].type == "Change"){
            if(board[i].power == "color"){
                dice.color == "Blue" ?
                    dice.color = "Orange" : dice.color = "Blue";
            }
            else if(board[i].power == "shape"){
                dice.shape == "Gost" ?
                    dice.shape = "Snail" : dice.shape = "Gost";
            }
            else if(board[i].power == "texture"){
                dice.texture == "Dotted" ?
                    dice.texture = "Striped" : dice.texture = "Dotted";
            }
        }
        else if(board[i].type == "Alien" &&
                board[i].shape == dice.shape &&
                board[i].texture == dice.texture &&
                board[i].color == dice.color){
            cardIndex = i;
        }

        if(i >= board.length-1){
            i = 0;
        }
        else{
            i++;
        }
    }

    return cardIndex;
}

//Calculating the 3 Vent card jump_to-s
function calcVentsJumpTos(board){
    var ventIndexes = [];
    board.forEach((c, index) => {
        if(c.type == "Vent"){
            ventIndexes.push(index);
        }
    });
    board[ventIndexes[0]].jump_to = ventIndexes[1];
    board[ventIndexes[1]].jump_to = ventIndexes[2];
    board[ventIndexes[2]].jump_to = ventIndexes[0];
}
