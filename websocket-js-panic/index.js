const { response } = require("express");
const http = require("http");
const app = require("express")();
const websocketServer = require("websocket").server;
const cors = require('cors');
const httpServer = http.createServer();

app.use(cors());
app.get("/", (req, res) => res.sendFile(__dirname+"/index.html"))
app.listen(9091, () => console.log("Listening on port 9091"));

httpServer.listen(9090, () => console.log("Listening on 9090"));

//hashmaps
const players = {};
const games = {};

const wsServer = new websocketServer({
    "httpServer" : httpServer
});

wsServer.on("request", request => {

    //someone who wants to connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"));
    connection.on("closed", () => console.log("closed!"));
    connection.on("message", message => {
        //We expect to get JSON!!
        const response = JSON.parse(message.utf8Data);

        //The player creates a game
        //and becomes the master of the first round
        if (response.method === "create") {
            const playerId = response.playerId;
            const gameId = guid();
            const boardSeed =  Math.floor(Math.random() * 10001) + 1

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

        //A new player joins the game
        //waiting room
        if (response.method === "join") {
            const playerId = response.playerId;
            const gameId = response.gameId;

            const game = games[gameId];

            if (game.players.length >= 10){
                //TODO: send back something
                //max players reached
                return;
            }

            game.players.push({
                "playerId": playerId
            });

            players[playerId].tokens = 0;

            const payLoad = {
                "method": "join",
                "players": game.players
            }

            //broadcast player infos to all players
            //(waiting room)
            game.players.forEach(c => {
                players[c.playerId].connection.send(JSON.stringify(payLoad))
            });
        }

        //broadcast game to its players
        if (response.method === "start") {
            const gameId = response.gameId;
            const game = games[gameId];

            const payLoad = {
                "method": "start",
                "game": game
            };

            game.players.forEach(c => {
                players[c.playerId].connection.send(JSON.stringify(payLoad));
            });
        }

        //The roll of the master and send cubes to other players
        if (response.method === "roll") {
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
                                    "0": "Red,white",
                                    "1": "Red,black",
                                    "2": "Blue,white",
                                    "3": "Blue,black",
                                    "4": "Yellow,white",
                                    "5": "Yellow,black"
                                }[Math.floor(Math.random() * 6)];

            const payLoad = {
                "method": "roll",
                "dices": game.dices
            };

            game.players.forEach(c => {
                players[c.playerId].connection.send(JSON.stringify(payLoad));
            });
        }

        //The player chooses a card
        //Returns the players infos...
        //TODO: Return all players choices...
        if (response.method === "choose") {
            const playerId = response.playerId;
            const gameId = response.gameId;
            const card = response.card;
            
            const timestamp = new Date();

            const game = games[gameId];

            players[playerId].choice = {
                "card" : card,
                "timestamp": timestamp
            };

            const payLoad = {
                "method": "choose",
                "players": players[playerId].choice
            };

            game.players.forEach(c => {
                players[c.playerId].connection.send(JSON.stringify(payLoad));
            });
        }

    });


    //generate new playerId
    const playerId = guid();

    //update the hash
    //TODO: give players names (by registration or something...)
    players[playerId] = {
        "connection": connection
    };

    const payLoad = {
        "method": "connect",
        "playerId": playerId
    };

    //send back the player connect
    connection.send(JSON.stringify(payLoad));
});


//The id generating function
//NOTE: for rooms it is quite large
const guid=()=> {
    const s4=()=> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);     
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}


//TODO: Random number generator with seed! (for the card shuffle)
//In plain JS you can't do that...
//See: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
//Maybe these will work...
//Note: seed can not be zero or any multiple of Math.PI
function random(seed) {
    var x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
  }

//Shuffle the array bellow or generate it randomly....
//TODO: Calculate Vent card jump-to-s after the shuffle
var board = [
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Dotted",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Dotted",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Dotted",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Dotted",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Striped",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Striped",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Striped",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Gost",
        "texture": "Striped",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Dotted",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Dotted",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Dotted",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Dotted",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Striped",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Striped",
        "color": "Orange"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Striped",
        "color": "Blue"
    },
    {   
        "type": "Alien",
        "shape": "Snail",
        "texture": "Striped",
        "color": "Blue"
    },
    {   
        "type": "Change",
        "power": "shape"
    },
    {   
        "type": "Change",
        "power": "color"
    },
    {   
        "type": "Change",
        "power": "texture"
    },

    {   
        "type": "Vent",
        "jump-to": null
    },
    {   
        "type": "Vent",
        "jump-to": null
    },
    {   
        "type": "Vent",
        "jump-to": null
    },
    {   
        "type": "Generator",
        "color": "Red"
    },
    {   
        "type": "Generator",
        "color": "Blue"
    },
    {   
        "type": "Generator",
        "color": "Yellow"
    }
]
