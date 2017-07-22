var http = require('http');
var express = require('express');
var path = require('path');

var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;
var MongoWrapper = require('./mongoWrapper').Wrapper;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
	response.send("<html><body><h1>Your First Header</h1></body></html>");
});

app.use(function(request, response)
{
	response.render('404', {url:request.url});
});

http.createServer(app).listen(app.get('port'), function()
{
	console.log("Express server listening on port " + app.get('port'));
});