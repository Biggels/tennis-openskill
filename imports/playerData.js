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


const filePath = path.join(__dirname, '..', 'data', 'wta', 'wta_players.csv');
// const filePath = '../data/wta/wta_players.csv'; // this is just here for when i'm using the node REPL
// remember that __dirname is the directory of the script, while . is the directory from which node was run
const players = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);

// const players = [
//     {
//         player_id: 113190,
//         name_first: 'Bobby',
//         name_last: 'Riggs',
//         hand: 'U',
//         ioc: 'USA'
//     },
//     {
//         player_id: 200001,
//         name_first: 'Martina',
//         name_last: 'Hingis',
//         hand: 'R',
//         dob: '19800930',
//         ioc: 'SUI',
//         height: 170,
//         wikidata_id: 'Q134720'
//     }
// ]

const importData = async function () {
    await Player.deleteMany({});
    await Player.insertMany(players);
}

importData();

