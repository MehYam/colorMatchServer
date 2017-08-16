const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('client-sessions');

const app = express();
app.use(bodyParser.json());
app.use(session({
   cookieName: 'colorMatchSession',
//KAI: load this from a local non-repo file once we're out of prototyping
   secret: 'steve_rockwell_is_jouko_salomaa_dev_1',
   duration: 7 * 24 * 60 * 60 * 1000,
   httpOnly: true,
//   secure: true,   KAI: need https
   activeDuration: 24 * 60 * 60 * 1000
}));

app.use((req, res, next) => {
   if (req.colorMatchSession && req.colorMatchSession.user) {
      console.log('found colorMatchSession user cookie', req.colorMatchSession.user);
   }
   else {
      console.log('no user cookie, new session');
   }
   next();
});
app.use(express.static('public'));

let requests = 0;
app.get('/api/admin/users/get', (req, res) => {

   console.log("query:", req.query);

   const filter = {};
   if (req.query.firstName) {
      filter.firstName = req.query.firstName;
   }
   database.collection(dbUsers).find(filter).toArray( (err, docs) => {
      res.json(docs);
   });
});
app.post('/api/admin/users/add', (req, res) =>
{
   console.log("request body: ", req.body);

   let user = req.body;

   database.collection(dbUsers).insertOne(user, (err, result) => {

      // KAI: error handling....
      // find the newly inserted row and send it back as the response
      if (err) {
         console.error("addUser failed: ", err);
      }
      else {
         const newId = result.insertedId;
         database.collection(dbUsers).find( {_id: newId} ).next( (err, doc) => {
            console.log('user added', doc);
            res.json(doc);
         });
      }
   });
});
app.post('/api/signin', (req, res) =>
{
   console.log('signin req.body', req.body, 'cookie', req.colorMatchSession);

   let user = req.body;

   // don't pass the query in directly from the client, recompose it to be sure
   let query = {firstName: user.firstName};
   database.collection(dbUsers).find(query).next( (err, doc) => {

      if (err || !doc) {
         console.error('user not found', user);
         res.json({error: 'could not find user ' + query.firstName});
      }
      else {
         console.log('found user', doc);

         req.colorMatchSession.user = query;
         res.json({user: query, error: false});
      }
   });
});
app.get('/api/signout', (req, res) =>
{
   // not sure how to structure the session/signed-in state of the app, but implementing this is the next step in making it work
   if (req.colorMatchSession) {

      console.log("logging out, resetting session");
      req.colorMatchSession.reset();
   }
   res.sendStatus(200);
});

//KAI: this should come from the db, eventually
const gameSettings = {
   width: 3,
   height: 3,
   playerPaletteSize: 7
};
gameSettings.palette = require('./palette1').palette1;  

app.post('/api/createGame', (req, res) => 
{
   console.log('creating game');

   let gameRequest = req.body;
   getUserDocFromSession(req, 
      (doc) => {
         const newGame = createGame([doc.firstName, gameRequest.opponent], gameSettings);

         console.log('game created', newGame);
         database.collection(dbGames).insertOne(newGame, (err, result) => {
            if (err) {
               console.error('createGame failed', err);
            }
            else {
               console.log('createGame success');
            }
            res.json([]);
         });
      },
      (error) => {
         console.error('createGame user not found', error);
         res.json([]);
      }
   );
});
app.get('/api/getGames', (req, res) =>
{
   getUserDocFromSession(req, 
      (doc) => {
         database.collection(dbGames).find().toArray( (err, docs) => {
            res.json(docs);
         });
      },
      (error) => {
         console.error(error);
         res.json([]);
      }
   );
});
app.post('/api/getGame', (req, res) =>
{
   //KAI: authenticate the call - make sure 1) the user can make calls at all, and 2) has access to this particular game
   const gameId = req.body;

   console.log('getGame', gameId, gameId.gameId);
   database.collection(dbGames).find( {_id: ObjectId(gameId.gameId)} ).next( (err, doc) => {

      if (err || !doc) {
         console.error('could not locate game', gameId.gameId, err);
         res.status(500).json({});
      }
      else {
         console.log('found game', doc);
         res.json(doc);
      }
   });
});
app.get('/api/getVoting', (req, res) =>
{
   getUserDocFromSession(req,
      (doc) => {
         database.collection(dbGames).find({complete: true}).toArray( (err, docs) => {

            if (err || !doc) {
               console.error('getVoting error', err);
               res.status(500).json([]);
            }
            else {
               console.log('getVoting found', docs.length);

               const candidates = shuffle(docs).slice(0, 3);

               // add one view count to each of these games
               candidates.forEach((game) => {
                  game.elections = game.elections ? (game.elections + 1) : 1;
                  database.collection(dbGames).updateOne({ _id: ObjectId(game._id) }, game);
               });
               res.json(candidates);
            }
         });
      },
      (error) => {
         console.error('tried to get votes without signing in')
         res.status(500).json([]);
      }
   );
});
app.post('/api/doVote', (req, res) =>
{
   getUserDocFromSession(req,
      (user) => {
         // retrieve the game, ensure that it's votable
         const gameId = req.body;

         database.collection(dbGames).find( {_id: ObjectId(gameId.gameId)} ).next( (err, game) => {

            if (err || !game || !game.complete) {
               console.error('doVote could not locate completed game', gameId.gameId, err);
               res.status(500).json({});
            }
            else {
               game.votes = game.votes ? (game.votes + 1) : 1;  //KAI: can simplify this

               // update votes
               database.collection(dbGames).updateOne({ _id: ObjectId(game._id) }, game);

               // update user vote count
               user.votesCast = user.votesCast ? (user.votesCast + 1) : 1;
               database.collection(dbUsers).updateOne({ _id: ObjectId(user._id) }, user);

               res.sendStatus(200);
            }
         });
      },
      (error) => {
         console.error('tried to doVote without signing in')
         res.status(500).json({});
      }
   );
});

app.post('/api/doMove', (req, res) => 
{
   const move = req.body;

   getUserDocFromSession(req, 
      (doc) => {
         database.collection(dbGames).find( {_id: ObjectId(move.gameId)} ).next( (err, game) => {
            if (err || !game) {
               console.error('could not locate game', move.gameId, err);
               res.status(500).json({'error': 'game not found'});
            }
            else {
               // retrieve the game, attempt the move.  doMove() returns false for invalid moves, although an untampered-with client
               // should never generate one
               //doMove(game, player, x, y, paletteIndex)
               if (doMove(game, doc.firstName, move.x, move.y, move.paletteIdx)) {

                  console.log('doMove successful');

                  // client will reload to see new game state
                  saveGame(game, res);

                  //KAI: set a notification on all the other players

                  //KAI: check if the game is complete, if so either mark it as such, or move to other table
               }
               else {
                  res.status(500).json({'error': 'invalid move'});
               }
            }
         });
      },
      (error) => {
         console.error(error);
         res.status(500).json({});
      }
   );
});

const MOVE_COMPLETED_GAMES = false;
function saveGame(game, res) {

   const saveHandler = (err, result) => {
      if (err) {
         console.log('error in saveGame', err, result);
         res.status(500).json({'error': 'move not saved'});
      }
      else {
         res.json(game);
         console.log('game saved');
      }
   }

   game.complete = (game.width * game.height) == game.moves.length;

   database.collection(dbGames).updateOne({ _id: ObjectId(game._id) }, game, saveHandler);

   if (game.complete && MOVE_COMPLETED_GAMES) {
      //KAI: technically, we shouldn't do the update to the game right before this if we're just going to delete it,
      // but I think this logic will never be used anyway
      console.log('saveGame completed, moving game to other collection');

      database.collection(dbGamesCompleted).insertOne(game, saveHandler);
      database.collection(dbGames).deleteOne({ _id: ObjectId(game._id) });
   }
}

function getUserDocFromSession(req, success, error) {

   if (req.colorMatchSession && req.colorMatchSession.user) {
      const user = req.colorMatchSession.user;
      const query = {firstName: user.firstName};
      database.collection(dbUsers).find(query).next( (err, doc) => {
         if (err || !doc) {
            error('user not found ' + query);
         }
         else {
            success(doc);
         }
      });
   }
}

///////////////////////////////////////////////
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const HTTPPort = 3000;

let database = null;
const dbUsers = 'users';
const dbGames = 'games';
const dbGamesCompleted = 'gamesCompleted';

const mongoHost = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/cm1';

console.log('connecting to MongoDB at', mongoHost);

mongoClient.connect(mongoHost, (err, db) => {
   if (err) {
      console.error('could not connect to mongodb on localhost');
      process.exit(1);
   }
   console.log('ColorMatch connected to mongodb');
   database = db;

   app.listen(HTTPPort, () => console.log('ColorMatch server listening on port ' + HTTPPort));
});

//////////////////////////////////////////////////
const seedrandom = require('seedrandom');
function createGame(playerIds, settings) {

   const totalPlayerColors = playerIds.length * settings.playerPaletteSize;

   console.log("colors", totalPlayerColors, settings.width, 'x', settings.height);
   console.assert(playerIds && playerIds.length > 1, 'not enough players');
   console.assert(totalPlayerColors >= (settings.width * settings.height), 'palette too small for board');
   console.assert(totalPlayerColors <= settings.palette.length, 'palette too small for players');

   // create a game representation for storage in the db
   Math.seedrandom();
   const newGame = 
   {
      seed: Math.random(),
      width: settings.width,
      height: settings.height,

      players: [],
      moves: []
   };

   Math.seedrandom(newGame.seed);

   // fill out the player states, including randomized palettes
   const colorsUsed = [];

   function addPlayer(id) {
      const player = {
         id: id,
         palette: []
      };
      for (let i = 0; i < settings.playerPaletteSize; ++i) {

         // choose a color, unique across both players
         let colorIdx = Math.floor(Math.random() * settings.palette.length);
         while(colorsUsed.indexOf(settings.palette[colorIdx]) != -1) {
            ++colorIdx;
            if (colorIdx >= settings.palette.length) {
               colorIdx = 0;
            }
         }
         const color = settings.palette[colorIdx];
         colorsUsed.push(color);
         player.palette.push(color);
      }
      return player;
   }

   playerIds.forEach((id) => {
      console.log('creating game for', id);
      newGame.players.push(addPlayer(id));
   })
   console.log('done creating game');
   return newGame;
}
function clamp(number, min, max) {
   return Math.max(Math.min(number, max), min);
}
// return 'true' if the move could be made, 'false' if it fails validation
function doMove(game, playerId, x, y, paletteIdx) {

//KAI: these must all be tested
   console.log('doMove', game);

   // validate space left on the board
   const boardSize = game.width * game.height;
   if (game.moves.length >= boardSize) {
      console.error('doMove error - more moves than board spaces');
      return false;
   }

   // validate player making their own moves
   const currentPlayerIdx = game.moves.length % game.players.length;
   const currentPlayer = game.players[currentPlayerIdx];
   if (currentPlayer.id != playerId) {
      console.error('doMove error - wrong player');
      return false;
   }

   // validate board space is unused
   if (game.moves.find((move) => move.x == x && move.y == y)) {
      console.error('doMove error - board space non-empty');
      return false;
   }

   // check that the color is unused - KAI: this is screwed up, only every other move is this players
   paletteIdx = clamp(paletteIdx, 0, currentPlayer.palette.length - 1);
   if (game.moves.find((move) => move.player == currentPlayer.id && move.paletteIdx == paletteIdx)) {
      console.error('doMove error - color already used');
      return false;
   }

   // this move looks good.  Apply it
   game.moves.push({ 
      player: currentPlayer.id,
      x: x,
      y: y,
      paletteIdx: paletteIdx
   });
   return true;
}
function shuffle(array) {
   const retval = array.slice();
   for (let i = 0; i < retval.length; ++i) {
      const iRnd = Math.floor(Math.random() * retval.length);
      const tmp = retval[i];
      retval[i] = retval[iRnd];
      retval[iRnd] = tmp;
   }
   return retval;
}