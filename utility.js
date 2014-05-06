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

var minL2Distance = function(user, lat, lon, data) {
	var max_dist = 100;	// dummy value
	var arr_ctr = 0;
	var dist_arr = new Array();

	var flagFoundUser = false;

	for (var i = 0; i < data.length; i++) {
		if (data[i].user != user) {
			var dist_lat = data[i].lat;
			var dist_lon = data[i].lon;
			var dist = Math.sqrt(Math.pow((dist_lat - lat), 2) + Math.pow((dist_lon - lon), 2));

			if (dist <= max_dist) {
				flagFoundUser = true;

				max_dist = dist;
				arr_ctr = i;
				// add distance object to array
				// dist_arr[arr_ctr] = data[i];
				// arr_ctr += 1;
				console.log(max_dist);
			}
			console.log('distance ' + dist);
		}
	}

	if (DEBUG) {
		console.log(JSON.stringify(data[arr_ctr]));
	}

	if (flagFoundUser) {
		// stringify needed if sevearl users sent back
		// return JSON.stringify(data[arr_ctr]);
		return data[arr_ctr];
	} else {
		return null;
	}

}

exports.DEBUG = DEBUG;
exports.minL2Distance = minL2Distance;
exports.readContent = readContent;