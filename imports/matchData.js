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

// TODO test different approaches to see if there's a faster way (different batch sizes made no difference, but maybe the original await each file approach was faster. or maybe there's a way to do it more parallel)
const importData = async function (tour) {
    await Match.deleteMany({});
    console.log('all matches deleted');
    const dir = path.join(__dirname, '..', 'data', tour);
    const fileNames = fs.readdirSync(dir);

    const matches = [];
    for (let fileName of fileNames) {
        if (fileName.startsWith(`${tour}_matches`)) {
            const filePath = path.join(__dirname, '..', 'data', tour, fileName); // if using REPL, you won't have __dirname, so just use `../data/${tour}/${fileName}`
            const newMatches = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
            matches.push(...newMatches);
            console.log(fileName, 'pushed');
        }
    }
    // inserting all 700k+ matches at once caused a memory error, so i'm batching them
    const batchSize = 100000;
    for (let i = 0; i < matches.length / batchSize; i++) {
        const start = i * batchSize;
        const end = start + batchSize;
        const batch = matches.slice(start, end);
        await Match.insertMany(batch);
        console.log('batch', i, 'inserted');
    }

    console.log('all matches inserted');

}

importData('wta');

