// TODO decide how to keep data in sync...git subtrees or something like that?
// TODO figure out how to add ATP 
// (sep dbs? same db with sep collections like atp_players and wta_matches? i guess that would mean i would need wta_match and atp_match schemas, etc.,
// seems clunky, b/c then i'd need to keep two copies of schemas updated...so maybe sep dbs would be better...can you connect to 2 dbs at once with mongoose?...
// maybe sep routes as well, or a query param, like /players?tour=atp, or /search?tour=atp)
// theoretically could combine all players into 1 collection, and all matches into 1 collection, but i don't think his data is set up to support that
// would have to record tour for each document, and i don't think the player ids are unique between the 2 tours (indeed they are not, just double-checked, so that's out)
// from some light research, it looks like it should be possible to do some kind of extending, so i could set up a base schema for player,
// and then create 2 models from it, one for wta_player and one for atp_player, making any modifications if there are any
// initially i think the 2 models would use exactly the same schema, so i wouldn't even need to extend anything
// but one person suggested just spreading the parent schema into the child (...ParentSchema.obj), and then adding anything new to the child, if i need to do that
// and actually mongoose has an add() method that makes this easier/more comprehensive (https://mongoosejs.com/docs/api/schema.html#Schema.prototype.add())
// but yeah, initially i would just have to have 2 model compiling lines, ATPPlayer and WTAPlayer, that both use the same playerSchema, and that's probably fine
// then i'll have to do some thinking about how to handle filtering the various routes, etc., but that should be doable, and at least i don't need to switch b/t dbs
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

app.get('/players', async (req, res) => { // this will likely eventually turn into the rating sorted leaderboard
    // TODO look into session for pagination instead of query params
    const playersCount = await Player.countDocuments({});
    let limit = Math.min(Math.abs(req.query.limit), 100) || 50;
    const maxPage = Math.floor(playersCount / limit);
    let page = Math.min(Math.abs(req.query.page), maxPage) || 0;

    const players = await Player.find({}).limit(limit).skip(page * limit).exec();
    const title = 'All Players';
    res.render('players/index', { title, players, playersCount, limit, page, maxPage });
})

app.get('/players/:id', async (req, res) => {
    const { id } = req.params;
    const player = await Player.findOne({ player_id: id });
    // TODO handle failure to find player with that id (missing player page with a button to go home? just redirect home?)
    const matches = await player.getMatches();

    const title = player.fullName;

    res.render('players/show', { title, player, matches });
})

// TODO create index (paginated) and show routes for matches

// TODO create player search (form in a partial that can be on every page, then a route to receive the search query, then need mongoose function that can actually do the search)
// https://www.mongodb.com/docs/manual/core/link-text-indexes/#std-label-text-search-on-premises
// https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose

app.listen(3000, () => {
    console.log("i'm listening on port 3000");
})