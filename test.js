var utility = require('./utility');

// reference point
//37.382921, -122.089149

// north 
// 37.391326, -122.088892
// 360
console.log("north\t" + utility.getBearingFromLatLonDeg(37.382921, -122.089149, 37.391326, -122.088892));

// south
// 37.377158, -122.088570
// 180
console.log("south\t" + utility.getBearingFromLatLonDeg(37.382921, -122.089149, 37.377158, -122.088570));

// east
// 37.382853, -122.083334
// 270
console.log("east\t" + utility.getBearingFromLatLonDeg(37.382921, -122.089149, 37.382853, -122.083334));

// west
// 37.382955, -122.096037
// 90
console.log("west\t" + utility.getBearingFromLatLonDeg(37.382921, -122.089149, 37.382955, -122.096037));
