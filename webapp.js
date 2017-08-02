const assert = require('assert');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// app.get('/', function (req, res) {
//   res.send('Hello World - from webapp.js')
// })

app.use(express.static('public'));
app.use(bodyParser.json());

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
