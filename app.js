var express = require('express');
var fs = require('fs');
var app = express();


var user = require('./user');
var utility = require('./utility');
var data;
var port = 4000;

var DEBUG = utility.DEBUG;

/*
	ROUTES
*/

// get list of all users
// to be deprecated
app.get('/', function(req, res) {
	res.json(data);
});

// get last recorded coordinates for user with provided
// to be deprecated
app.get('/user/:id', function(req, res) {

	for (var i = 0 ; i < data.length; i++) {
		var u = data[i];
		if (u.user == req.params.id) {
			return res.json(u);
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

	// fix the User Object
	// var json_data = min_l2_distance(id, lat, lon);
	// var json_data = utility.minL2Distance(id, lat, lon);

	// do we need to use async callbacks?
	var json_data = utility.minL2Distance(id, lat, lon, data);

	if (json_data !== null) {
		res.json(json_data);
	} else {
		// check statusCode and comment
		res.statusCode = 500;
		res.send('No user found?');
	}

});

// post new user to list or update location of currently streaming user
app.post('/user', function(req, res) {

	// check if properties have been passed properly
	if (!req.body.hasOwnProperty('user') ||
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

	var new_user = new user(req.body.user, req.body.lat, req.body.lon);
	console.log(new_user.getUser());

	// generate new user
	// make user class
	// var new_user = {
	// 	user : req.body.user,
	// 	lat : req.body.lat,
	// 	lon : req.body.lon,
	// 	time : new Date()
	// };

	//
	var flag = true;

	for (var i = 0; i < data.length; i++) {

		// user can be of type string, should we update to === ?
		if (data[i].user == req.body.user) {
			data[i] = new_user;
			flag = false;
			break;
		}
	}

	if (flag) {
		data[data.length] = new_user;
	}

	if (DEBUG) {
		res.json(data);
	}

	res.statusCode = 200;
	return res.send();
});

// delete user with given id
app.delete('/user/:id', function(req, res) {
	for (var i = 0; i < data.length; i++) {
		if(data[i].user == req.params.id) {
			data.splice(i,1);

			if (DEBUG) {
				return res.json(data);
			}

			res.statusCode = 200;
			return res.send();
		}
	}

	res.statusCode = 404;
	return res.send('Error 404 : No user found');
});


/*
	SERIALIZATION CODE
*/


utility.readContent(function (err, content) {
	data = content;
	console.log(data);
});

/*
	INITIALIZATION CODE
*/

app.use(express.bodyParser());

if (!DEBUG) {
	// Send 500 if there is an internal server error in production
	// dont send details of error over to client
	app.use(function (err, req, res, next) {
	    res.send(500, 'Something broke!');
	});
}

app.listen(process.env.PORT || port);
console.log('listening at port ' + port);