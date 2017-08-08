const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('client-sessions');

const app = express();
app.use(bodyParser.json());
app.use(session({
   cookieName: 'colorMatchSession',
//KAI: load this from a local non-repo file
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
         console.error("insertOne failed: ", err);
      }
      else {
         const newId = result.insertedId;
         database.collection(dbUsers).find( {_id: newId} ).next( (err, doc) => {
            res.json(doc);
         });
      }
   });
});
app.post('/api/signin', (req, res) =>
{
   let user = req.body;

   console.log('signin req.body', req.body, 'cookie', req.colorMatchSession);

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
      req.colorMatchSession.reset();
   }
});
app.get('/api/createGame', (req, res) => 
{
});
app.get('/api/getGames', (req, res) =>
{
   getUserDocFromRequest(req, 
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

function getUserDocFromRequest(req, success, error) {

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
const mongoHost = 'mongodb://localhost:27017/cm1';
const HTTPPort = 3000;
var database = null;
var dbUsers = 'dev';
var dbGames = 'games';

mongoClient.connect(mongoHost, (err, db) => {
   if (err) {
      console.error('could not connect to mongodb on localhost');
      process.exit(1);
   }
   console.log('ColorMatch connected to mongodb');
   database = db;

   app.listen(HTTPPort, () => console.log('ColorMatch server listening on port ' + HTTPPort));
});
