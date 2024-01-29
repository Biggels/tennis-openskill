const mongoose = require('mongoose');
const Match = require('../models/match'); // . within require is supposed to be relative to the file, but that was not my experience
const csvToJson = require('convert-csv-to-json');
const path = require('path');
const fs = require('fs');

mongoose.connect('mongodb://127.0.0.1:27017/tennis')
    .then(() => {
        console.log('hurray mongo has connected')
    })
    .catch((err) => {
        console.log(err)
    })

// TODO read all matches into array first, then insertMany on all at once; or do batches of insertManys without awaiting them, since not awaiting all of them uses too much memory

const importData = async function (tour) {
    await Match.deleteMany({});
    console.log('all data deleted');
    const dir = path.join(__dirname, '..', 'data', tour);
    const fileNames = fs.readdirSync(dir);

    for (let fileName of fileNames) {
        if (fileName.startsWith(`${tour}_matches`)) {
            const filePath = path.join(__dirname, '..', 'data', tour, fileName); // if using REPL, you won't have __dirname, so just use `../data/${tour}/${fileName}`
            const matches = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
            await Match.insertMany(matches);
            console.log(fileName, 'inserted');
        }
    }
    console.log('all matches inserted');

}

importData('wta');

