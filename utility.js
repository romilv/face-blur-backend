var fs = require('fs');

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

exports.readContent = readContent;