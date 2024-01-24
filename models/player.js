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

// playerSchema.pre('save', async function () {
//     this.dob = `${this.dob.slice(0, 4)}-${this.dob.slice(4, 6)}-${this.dob.slice(6, 8)}`;
//     console.log(this.dob);
// })
// actually pre save hook won't get triggered, need to use pre insertMany hook, 
// since in seeds we're using insertMany, not using save method on each individual document
// be aware, when using a pre insertMany hook, "this" would refer to the model, not the document
playerSchema.pre('insertMany', async function (next, docs) {
    for (let doc of docs) {
        const dob = doc.dob;
        if (dob) {
            doc.dob = `${dob.slice(0, 4)}-${dob.slice(4, 6)}-${dob.slice(6, 8)}`;
        }
    }
    next(); // i think if i don't call this, any potential other middleware won't run after this one
})

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;