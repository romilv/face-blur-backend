var express = require('express');
var fs = require('fs');
var app = express();


var user = require('./user');
var User = user.User;
var utility = require('./utility');

var data;
var port = 4000;

var DEBUG = utility.DEBUG;

/*
	CONFIGURATIONS
	MUST BE BEFORE ROUTES
*/

app.configure(function() {
	app.use(express.bodyParser());
	app.use(app.router);
});

if (!DEBUG) {
	// Send 500 if there is an internal server error in production
	// dont send details of error over to client
	app.use(function (err, req, res, next) {
	    res.send(500, 'Something broke!');
	});
}

app.listen(process.env.PORT || port);
// console.log('listening at port ' + port);

/*
	SERIALIZATION CODE
*/

utility.readContent(function (err, content) {

	data = new Array();

	if (err) {
		// error reading content
		// create empty data array
		// no users to prepopulate
		console.log('error');
		return;
	}

	// prepoulate data

	for (var key in content) {
		data[data.length] = new User(content[key].user, 
			content[key].lat, 
			content[key].lon);
	}

});

/*
	ROUTES
*/

// get list of all users
// to be deprecated
app.get('/', function(req, res) {

	if (data || data.length !== 0) {
		return res.json(data);
	} 

	else {
		res.statusCode = 500;
		return res.send("No user found");
	}

});

// get last recorded coordinates for user with provided
// to be deprecated
app.get('/user/:id', function(req, res) {

	var reqUserId = req.params.id;

	for (var key in data) {
		// console.log(data[key]);
		var user = data[key];
		if (user.id === reqUserId) {
			return res.json(user);
		}
	}

	res.statusCode = 404;
	return res.send('Error 404 : no user found');
});

// get the closest user to requesting user
app.get('/user/:id/:lat/:lon', function(req, res) {
	var id = req.params.id;
	var lat = req.params.lat;
	var lon = req.params.lon;

	// do we need to use async callbacks?
	var json_data = utility.minL2Distance(id, lat, lon, data);

	if (json_data !== null) {
		res.json(json_data);
	} 
	else {
		// check statusCode and comment
		res.statusCode = 500;
		res.send('No user found?');
	}

});

// post new user to list or update location of currently streaming user
app.post('/user', function(req, res) {

	// check if properties have been passed properly
	if (!req.body.hasOwnProperty('id') ||
		!req.body.hasOwnProperty('lat') || 
		!req.body.hasOwnProperty('lon')) {


		res.statusCode = 400;
		return res.send('Error 400 : Post syntax is incorrect');	
	}

	// check if properties passed are of valid type
	if (!parseFloat(req.body.lat) || !parseFloat(req.body.lon)) {
		res.statusCode = 400;
		return res.send('Error 400 : invalide parameter types');
	}

	var newUser = new User(req.body.id, req.body.lat, req.body.lon);
	var flagUserExists = false;

	for (var i in data) {
		if (data[i].id === req.body.id) {
			data[i] = newUser;
			flagUserExists = true;
			break;
		}
	}

	if (!flagUserExists) {
		data[data.length] = newUser;
	}

	if (DEBUG) {
		res.json(data);
	}

	res.statusCode = 200;
	return res.send();
});

// delete user with given id
app.delete('/user/:id', function(req, res) {

	var reqUserId = req.params.id;

	for (var key in data) {
		var user = data[key];
		if(user.id === reqUserId) {
			data.splice(key, 1);

			if (DEBUG) {
				return res.json(data);
			}

			res.statusCode = 200;
			return res.send();
		}
	}

	res.statusCode = 404;
	return res.send('Error 404 : No user found to delete');
});