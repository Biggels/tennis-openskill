// TODO decide how to keep data in sync...git subtrees or something like that?
// TODO add ATP (sep dbs? same db with sep collections like atp_players and wta_matches? i guess that would mean i would need wta_match and atp_match schemas, etc., seems clunky, maybe sep routes as well, but maybe some are combined, like player search)
// TODO consider adding indexes for common queries
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Player = require('./models/player');
const Match = require('./models/match');

mongoose.connect('mongodb://127.0.0.1:27017/tennis')
    .then(() => {
        console.log('hurray mongo has connected')
    })
    .catch((err) => {
        console.log(err)
    })

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('hello! welcome to tennis!');
})

app.get('/players', async (req, res) => {
    const players = await Player.find({});
    // console.log(players);
    const title = 'All Players';

    res.render('players/index', { title, players });
})

app.get('/players/:id', async (req, res) => {
    const { id } = req.params;
    const player = await Player.findOne({ player_id: id });
    const matches = await Match.find({ $or: [{ winner_id: id }, { loser_id: id }] });
    // TODO handle failure to find player with that id (missing player page with a button to go home? just redirect home?)
    const title = player.fullName;

    res.render('players/show', { title, player, matches });
})

// TODO create index (paginated) and show routes for matches

app.listen(3000, () => {
    console.log("i'm listening on port 3000");
})