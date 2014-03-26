var fs = require('fs');

var data;
console.log('data ' + data);

function readContent(callback) {
	fs.readFile('data.json', function(err, data) {
		if (err) {
			console.log('error reading file ' + err);
			return callback(err);
		}
		callback(null, JSON.parse(data));
	});
}

readContent(function (err, content) {
	data = content;
	console.log('data ' + data);
	for (var i = 0; i < data.length; i++) 
		console.log(data[i]);
})