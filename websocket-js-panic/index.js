const http = require("http");
const app = require("express")();
const websocketServer = require("websocket").server;
const cors = require('cors');

const connect = require('./requests/connect');
const create = require('./requests/create');
const join = require('./requests/join');
const start = require('./requests/start');
const roll = require('./requests/roll');
const choose = require('./requests/choose');

app.use(cors());
app.get("/", (req, res) => res.sendFile(__dirname+"/index.html"));
app.listen(3000, () => console.log("Listening on port 3000"));

const httpServer = http.createServer();
httpServer.listen(9000, () => console.log("Listening on 9000"));
const wsServer = new websocketServer({
    "httpServer" : httpServer
});

wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"));
    connection.on("closed", () => console.log("closed!"));
    connection.on("message", message => {
        //We expect to get JSON!!
        const response = JSON.parse(message.utf8Data);

        if (response.method === "connect") {
            create(response);
        }

        //The player creates a game
        //and becomes the master of the first round
        else if (response.method === "create") {
            create(response);
        }

        //A new player joins the game
        //waiting room
        else if (response.method === "join") {
            join(response);
        }

        //broadcast game to its players
        else if (response.method === "start") {
            start(response);
        }

        //The roll of the master and send cubes to other players
        else if (response.method === "roll") {
            roll(response);
        }

        //The player chooses a card
        //Returns the player's infos...
        else if (response.method === "choose") {
            choose(response);
        }
    });
    //Creates new playerID for connection
    connect(connection);
});
