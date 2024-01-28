const mongoose = require('mongoose');
const Match = require('../models/match'); // . within require is supposed to be relative to the file, but that was not my experience
const csvToJson = require('convert-csv-to-json');
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/tennis')
    .then(() => {
        console.log('hurray mongo has connected')
    })
    .catch((err) => {
        console.log(err)
    })

// TODO import 1968 matches to test
// TODO import all matches...stich them together or just insertMany on each file? probably just insertMany on each file is fine
const filePath = path.join(__dirname, '..', 'data', 'wta', 'wta_matches_1968.csv');
// const filePath = '../data/wta/wta_matches_1968.csv'; // this is just here for when i'm using the node REPL
// remember that __dirname is the directory of the script, while . is the directory from which node was run
const matches = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);

const importData = async function () {
    await Match.deleteMany({});
    await Match.insertMany(matches);
}

importData();

