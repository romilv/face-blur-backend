var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.bodyParser());

var user = require('./user');
var utility = require('./utility');
var data;
var port = 4000;

/*
	ROUTES
*/

app.get('/', function(req, res) {
	res.json(data);
});

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

app.post('/user', function(req, res) {
	if (!req.body.hasOwnProperty('user') ||
		!req.body.hasOwnProperty('lat') || 
		!req.body.hasOwnProperty('lon')) {
		// !req.body.hasOwnProperty('time')) {
		res.statusCode = 404;
		return res.send('Error 400 : Post syntax is incorrect');	
	}

	// var new_user = new user.User(req.body.user, req.body.lat, req.body.lon);
	// console.log(new_user.getUser());

	var new_user = {
		user : req.body.user,
		lat : req.body.lat,
		lon : req.body.lon,
		// time : req.body.time
		time : new Date()
	};

	var flag = true;

	for (var i = 0; i < data.length; i++) {
		if (data[i].user == req.body.user) {
			data[i] = new_user;
			flag = false;
		}
	}
	if (flag)
		data[i] = new_user;
	res.json(data);
});

app.delete('/user/:id', function(req, res) {
	for (var i = 0; i < data.length; i++) {
		if(data[i].user == req.params.id) {
			data.splice(i,1);
			return res.json(data);
		}
	}
	res.statusCode = 404;
	return res.send('Error 404 : No user found');
});

/*
	OTHER HELPERS
*/

var l2_distance = function(lat, lon) {
	var dist_arr = new Array();
	for (var i = 0; i < data.length; i++) {
		var dist_lat = data[i].lat;
		var dist_lon = data[i].lon;
		var dist = Math.sqrt(Math.pow((dist_lat - lat), 2) + 
			Math.pow((dist_lon - lon), 2));
		console.log('distance ' + dist);
	}
}

/*
	INITIALIZATION CODE
*/


utility.readContent(function (err, content) {
	data = content;
	console.log(data);
});


app.listen(process.env.PORT || port);
console.log('listening at port ' + port);