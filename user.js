function User(id, latitude, longitude) {
	this.id = id;
	this.latitude = latitude;
	this.longitude = longitude;
	this.timestamp = new Date();

	this.getUser = function() {
		return JSON.stringify(this);
	};

	this.getLatestTimestamp = function() {
		return this.timestamp;
	};

	this.getId = function() {
		return this.id;
	};

}
