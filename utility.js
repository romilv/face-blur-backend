var fs = require('fs');

var DEBUG = true;

/*
	SERIALIZATION/DESERIALIZATION HELPERS
*/

var readContent = function(callback) {
	fs.readFile('data.json', function(err, data) {
		if (err) {
			console.log('error reading file ' + err);
			return callback(err);
		}
		callback(null, JSON.parse(data));
	});
};

/*
	OTHER HELPERS
*/

// Haversine Formula to calculate as-the-crow-flies distance
// http://www.movable-type.co.uk/scripts/latlong.html
// console.log(utility.getDistanceFromLatLonKm(59.3293371,13.4877472, 59.3225525,13.4619422));
// 1.6467932911662941
var getDistanceFromLatLonKm = function(lat1, lon1, lat2, lon2) {

	var R = 6371;	//radius of earth in km
	var deltaLat = degreeToRadian(lat2 - lat1);
	var deltaLon = degreeToRadian(lon2 - lon1);

	lat1 = degreeToRadian(lat1);
	lat2 = degreeToRadian(lat2);

	var a = 
		Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
		Math.cos(lat1) * Math.cos(lat2) * 
		Math.sin(deltaLon/2) * Math.sin(deltaLon/2);

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var distanceKm = R * c; 

	return distanceKm;
}

// lat1, lon1 are points of the user with camera
var getBearingFromLatLonDeg = function(lat1, lon1, lat2, lon2) {
	lat1 = degreeToRadian(lat1);
	lon1 = degreeToRadian(lon1);
	lat2 = degreeToRadian(lat2);
	lon2 = degreeToRadian(lon2);

	var deltaLon = (lon2 - lon1);

	var y = Math.sin(deltaLon) * Math.cos(lat2);
	var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
	var bearing = radianToDegree(Math.atan2(y, x));
	return 360 - ((bearing + 360) % 360);
}

var degreeToRadian = function(deg) {
  return deg * (Math.PI / 180);
}

var radianToDegree = function(rad) {
	return rad * (180 / Math.PI);
}

var getUsersInRange = function(id, lat, lon, data) {
	if (DEBUG) {
			console.log('distances');
	}
	
	var MAX_DIST_METERS = 100.0;	// maximum distance in meters that the phone will look for a user
	var candidateUsers = new Array();
	var flagFoundUsers = false;


	for (var i in data) {

		var user = data[i];

		if (user.id !== id) {

			var distanceInMeters = 
				getDistanceFromLatLonKm(lat, lon, user.latitude, user.longitude) * 1000;
			distanceInMeters = parseInt(distanceInMeters);

			if (distanceInMeters <= MAX_DIST_METERS) {
				flagFoundUsers = true;
				candidateUsers.push(user);
				console.log(distanceInMeters);
			}
		}
	} // end for

	// candidate users found, parse candidates
	if (flagFoundUsers) {
		return candidateUsers;
	} else {
		return null;
	}
}

var getUsersInDirection = function(id, lat, lon, dir, data) {
	if (DEBUG) {
		console.log('getUsersInDirection');
	}

	var candidateUsers = new Array();
	var flagFoundUsers = false;

	var min, max;
	// dir can be NW, NE, SW, SE
	// N - 360
	// S - 180
	// E - 270
	// W - 90
	switch (dir) {
		case "NW":
			min = 0;
			max = 90;
			break;
		case "NE":
			min = 270;
			max = 360;
			break;
		case "SW":
			min = 90;
			max = 180;
			break;
		case "SE":
			min = 180;
			max = 270;
	}


	for (var i in data) {

		var user = data[i];

		if (user.id !== id) {

			// first provide coordinates of user taking the picture
			var bearingInDegree = 
				getBearingFromLatLonDeg(lat, lon, user.latitude, user.longitude);

			if (min <= bearingInDegree && bearingInDegree <= max) {
				flagFoundUsers = true;
				candidateUsers.push(user);
				console.log(bearingInDegree);
			}
		}
	} // end for

	if (flagFoundUsers) {
		return candidateUsers;
	} else {
		return null;
	}
}

exports.DEBUG = DEBUG;
exports.getBearingFromLatLonDeg = getBearingFromLatLonDeg;
exports.getUsersInDirection = getUsersInDirection;
exports.getUsersInRange = getUsersInRange;
exports.readContent = readContent;