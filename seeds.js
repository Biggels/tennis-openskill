const mongoose = require('mongoose');
const Player = require('./models/player');
const Match = require('./models/match');
const csvToJson = require('convert-csv-to-json');

mongoose.connect('mongodb://127.0.0.1:27017/tennis')
    .then(() => {
        console.log('hurray mongo has connected')
    })
    .catch((err) => {
        console.log(err)
    })

// TODO use csv to json library to seed with players csv
const players = [
    {
        player_id: 113190,
        name_first: 'Bobby',
        name_last: 'Riggs',
        hand: 'U',
        ioc: 'USA'
    },
    {
        player_id: 2000001,
        name_first: 'Martina',
        name_last: 'Hingis',
        hand: 'R',
        dob: '19800930',
        ioc: 'SUI',
        height: 170,
        wikidata_id: 'Q134720'
    }
]
const seed = async function () {
    await Player.deleteMany({});
    await Player.insertMany(players);
}

seed();

