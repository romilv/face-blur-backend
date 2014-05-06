var utility = require('./utility');
var DEBUG = utility.DEBUG;


function User(id, latitude, longitude) {
	this.id = id;
	this.latitude = latitude;
	this.longitude = longitude;
	this.timestamp = new Date();

	// this.getUser = function() {
	// 	return JSON.stringify(this);
	// };

}

exports.User = User;