const mongoose = require('mongoose');
const Player = require('../models/player'); // . within require is supposed to be relative to the file, but that was not my experience
const csvToJson = require('convert-csv-to-json');
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/tennis')
    .then(() => {
        console.log('hurray mongo has connected')
    })
    .catch((err) => {
        console.log(err)
    })




const importData = async function (tour) {
    await Player.deleteMany({});
    const filePath = path.join(__dirname, '..', 'data', tour, `${tour}_players.csv`);
    // const filePath = '../data/wta/wta_players.csv'; // this is just here for when i'm using the node REPL
    // remember that __dirname is the directory of the script, while . is the directory from which node was run
    const players = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
    await Player.insertMany(players);
}

importData('wta');

