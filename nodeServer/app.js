const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');	

mongoose.set('useCreateIndex', true);

const playerRoute = require('./routes/player');

app.use(cors());
app.use(bodyParser.json());

app.use('/player', playerRoute);

app.get('/', (req, res) => {
    res.send('We are on home');
});

dbURL = 'mongodb://localhost:27017/paniclab2020'
mongoose.connect(dbURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Connected to database: " + dbURL);
});

var server = app.listen(9000, () =>{
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});
