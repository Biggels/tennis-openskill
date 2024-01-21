const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    player_id: {
        type: Number,
        required: true
    },
    name_first: {
        type: String
    },
    name_last: {
        type: String,
        required: true
    },
    hand: {
        type: String
    },
    dob: { // will need to add the dashes, and also may want a getter with a try..catch to return dob.toDateString() or null/undefined
        type: Date
    },
    ioc: {
        type: String
    },
    height: {
        type: Number
    },
    wikidata_id: {
        type: String
    }
})

playerSchema.virtual('fullName')
    .get(function () {
        return `${this.name_first} ${this.name_last}`;
    })
    .set(function (v) {
        this.name_first = v.substr(0, v.indexOf(' '));
        this.name_last = v.substr(v.indexOf(' ') + 1);
    });

playerSchema.virtual('birthdate')
    .get(function () {
        try {
            return this.dob.toDateString();
        } catch {
            return null;
        }
    })

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;