const assert = require('assert');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('client-sessions');

// app.get('/', function (req, res) {
//   res.send('Hello World - from webapp.js')
// })

app.use(bodyParser.json());
app.use(session({
   cookieName: 'colorMatchSession',
//KAI: load this from a local non-repo file
   secret: 'steve_rockwell_is_jouko_salomaa_dev_1',
   duration: 7 * 24 * 60 * 60* 1000,
   httpOnly: true,
//   secure: true,   KAI: need https
   activeDuration: 24 * 60 * 60 * 1000
}));

app.use((req, res, next) => {
   if (req.colorMatchSession && req.colorMatchSession.testcookie) {

      console.log('found testcookie');
   }
   else {
      console.log('not found testcookie');
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
   database.collection(table).find(filter).toArray( (err, docs) => {
      res.json(docs);
   });
});
app.post('/api/admin/users/add', (req, res) =>
{
   console.log("request body: ", req.body);

   let user = req.body;

   database.collection(table).insertOne(user, (err, result) => {

      // KAI: error handling....
      // find the newly inserted row and send it back as the response
      if (err) {
         console.error("insertOne failed: ", err);
      }
      else {
         const newId = result.insertedId;
         database.collection(table).find( {_id: newId} ).next( (err, doc) => {
            res.json(doc);
         });
      }
   });
});
app.post('/api/signin', (req, res) =>
{
   let user = req.body;
   user = {firstName: 'Kai'};

   console.log('signin req.body', req.body, 'cookie', req.colorMatchSession);

   database.collection(table).find(user).next( (err, doc) => {

//KAI: left off here - respond to errors?
      console.log('found user', doc, 'err', err);
   });

   req.colorMatchSession.testcookie = true;
   res.send('');
});
app.post('/api/signout', (req, res) =>
{
   //KAI: left off here.

   // not sure how to structure the session/signed-in state of the app, but implementing this is the next step in making it work
});

///////////////////////////////////////////////
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoHost = 'mongodb://localhost:27017/cm1';
const HTTPPort = 3000;
var database = null;
var table = 'dev';

mongoClient.connect(mongoHost, (err, db) => {
   if (err) {
      console.error('could not connect to mongodb on localhost');
      process.exit(1);
   }
   console.log('ColorMatch connected to mongodb');
   database = db;

   app.listen(HTTPPort, () => console.log('ColorMatch server listening on port ' + HTTPPort));
});
