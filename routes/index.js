var path = require('path');

var index = function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/index.html'));
};

module.exports.index = index;