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

app.use(session(
{
	cookieName: 'session',
	secret: 'colorMatchSessionV0_0_1-b5f38e54-ed3e-4c70-8c7c-608a12cd51ac',
	duration: 7 * 24 * 60 * 60 * 1000,
	activeDuration: 12 * 60 * 60 * 1000,
}));

var mongoWrapper;
MongoClient.connect('mongodb://localhost:27017/cm1', function(error, db)
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

app.get('/getUsers', function(request, response)
{
	mongoWrapper.findAll('users', function(error, results)
	{
		if (error)
		{
			response.send("MongoDB error: " + error);
		}
		else
		{
			response.send(results);
		}
	});
});
app.get('/getUser', function(request, response)
{
	mongoWrapper.findAll('users', function(error, results)
	{
		if (error)
		{
			response.send("MongoDB error: " + error);
		}
		else
		{
			response.send(results);
		}
	});
});
app.get('/addUser/:userName/:firstName/:lastName', function(request, response)
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