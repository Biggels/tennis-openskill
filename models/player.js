const mongoose = require('mongoose');
const Match = require('./match');

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

// TODO create full name as actual property so i can index and search it?
// actually mongodb docs say the index can cover multiple fields, so this may already work
playerSchema.index({ name_last: 'text', name_first: 'text' });

// tested out a virtual for getting player's matches (probably won't be friendly if it's returning a promise)
// i can return the promise, but that doesn't help me, it doesn't actually resolve when i access the virtual field
// b/c when i access the field i'm in the front end where we won't have access to the db to run the find (or maybe it's not allowed to at all, i'm not sure)
// playerSchema.virtual('matches')
//     .get(async function () {
//         return Match.find({ $or: [{ winner_id: this.player_id }, { loser_id: this.player_id }] });
//     })
// maybe i can do a post find hook that finds the matches and adds them? maybe better to just have a custom method that i can call on demand, when i know it will work.
playerSchema.methods.getMatches = async function () { // TODO add args to getMatches for filtering by surface, date, etc.
    return Match.find({ $or: [{ winner_id: this.player_id }, { loser_id: this.player_id }] });
} // should be able to do await player.getMatches.limit.skip.filter.sort.exec pattern, i think, because i think this returns a query

// TODO add other "get" methods for calculating other match related data like first and last match and date, length of career, matches in the last x time period, matches on each surface, etc.
// these can build off of the improved version of getMatches, e.g. we have a getSurfaceCounts that wraps calls to getMatches('clay'), getMatches('hard'), etc....will need to think about how to organize


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
playerSchema.pre('insertMany', function (next, docs) {
    for (let doc of docs) {
        if (doc.dob) {
            // there's a player whose dob is 19000000, which won't be valid date, so we'll set any like that to XXXX0101 instead
            if (doc.dob.slice(4).startsWith('00') || doc.dob.slice(6).startsWith('00')) {
                doc.dob = doc.dob.slice(0, 4) + '0101';
            }
            doc.dob = `${doc.dob.slice(0, 4)}-${doc.dob.slice(4, 6)}-${doc.dob.slice(6, 8)}`;
        }
    }
    next(); // i think if i don't call this, any potential other middleware won't run after this one
    // it also means it won't continue on to the insertMany. so very important :P
})

// insertMany says it validates every document, but i guess that doesn't trigger validate middleware? that makes no sense...
// playerSchema.pre('validate', function (next) {
//     // there's a player whose dob is 19000000, which won't be valid date, so we'll set any like that to XXXX0101 instead
//     console.log('hello from pre validate hook');
//     if (this.dob) {
//         if (this.dob.slice(4).startsWith('00') || this.dob.slice(6).startsWith('00')) {
//             this.dob = this.dob.slice(0, 4) + '0101';
//         }
//     }
//     next();
// })

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;