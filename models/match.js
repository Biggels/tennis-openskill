const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    tourney_id: String,
    tourney_name: String,
    surface: String,
    draw_size: String,
    tourney_level: String,
    tourney_date: {
        type: Date,
        required: true
    },
    match_num: Number,
    winner_id: Number,
    winner_seed: String,
    winner_entry: String,
    winner_name: String,
    winner_hand: String,
    winner_ht: Number,
    winner_ioc: String,
    winner_age: Number,
    loser_id: Number,
    loser_seed: String,
    loser_entry: String,
    loser_name: String,
    loser_hand: String,
    loser_ht: Number,
    loser_ioc: String,
    loser_age: Number,
    score: String,
    best_of: Number,
    round: String,
    minutes: Number,
    w_ace: Number,
    w_df: Number,
    w_svpt: Number,
    w_1stIn: Number,
    w_1stWon: Number,
    w_2ndWon: Number,
    w_SvGms: Number,
    w_bpSaved: Number,
    w_bpFaced: Number,
    l_ace: Number,
    l_df: Number,
    l_svpt: Number,
    l_1stIn: Number,
    l_1stWon: Number,
    l_2ndWon: Number,
    l_SvGms: Number,
    l_bpSaved: Number,
    l_bpFaced: Number,
    winner_rank: Number,
    winner_rank_points: Number,
    loser_rank: Number,
    loser_rank_points: Number
})

matchSchema.virtual('tourney_dateString')
    .get(function () {
        try {
            return this.tourney_date.toDateString();
        } catch {
            return null;
        }
    })

matchSchema.pre('insertMany', function (next, docs) {
    for (let doc of docs) {
        doc.tourney_date = `${doc.tourney_date.slice(0, 4)}-${doc.tourney_date.slice(4, 6)}-${doc.tourney_date.slice(6, 8)}`;
    }
    next();
})

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;