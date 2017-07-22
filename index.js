var http = require('http');
var express = require('express');
var path = require('path');
var session = require('client-sessions');

var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;
var MongoWrapper = require('./mongoWrapper').Wrapper;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));  // was being used for jade, although that's removed

//	KAI: left off here, following https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
app.use(session(
{
	cookieName: 'session',
	secret: 'colorMatchSessionV0_0_1-b5f38e54-ed3e-4c70-8c7c-608a12cd51ac',
	duration: 7 * 24 * 60 * 60 * 1000,
	activeDuration: 12 * 60 * 60 * 1000,
}));

var mongoWrapper;
MongoClient.connect('mongodb://localhost:27017/mongo-server', function(error, db)
{
	if (error)
	{
		console.error("Error: could not connect to MongoDB - is the server running?");
		process.exit(1);
	}
	mongoWrapper = new MongoWrapper(db);
});

app.get('/', function(request, response)
{
	response.send("<html><body><h1>Reached the root responder</h1></body></html>");
});

//KAI: add a bunch of methods where we just parse the arguments and console them out

// AddUser(...)
app.get('/addUser/:userName', function(request, response)
{
	response.send("<html><body><h1>addUser " + request.params.userName + "</h1></body></html>");
});
app.get('/createGame', function(request, response)
{
	console.log("createGame");
});
app.get('/getGames', function(request, response)
{
	console.log("getGames");
});

app.use(function(request, response)
{
	response.render('404', {url:request.url});
});

http.createServer(app).listen(app.get('port'), function()
{
	console.log("Express server listening on port " + app.get('port'));
});