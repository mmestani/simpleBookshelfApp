var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var route = require('./routes/users');

app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));

/* Routes */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/users', route.saveUser);
app.get('/users', route.getAllUsers);
app.delete('/user/:id', route.deleteUser);
app.get('/user/:id', route.getUser);

app.listen(3000, function () {
	console.log('Go to localhost:3000');
});