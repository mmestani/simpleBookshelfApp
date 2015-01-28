var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));

/* Router */
require('./router')(app);

app.listen(3000, function () {
	console.log('Go to localhost:3000');
});