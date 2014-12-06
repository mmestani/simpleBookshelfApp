var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var DBConfig = {
	client: 'mysql',
	connection: {
		host: 'localhost',
		user: 'root',
		password: 'mendim',
		database: 'simple_bookshelf',
		charset: 'utf8'
	}
};

var knex = require('knex')(DBConfig);
var bookshelf = require('bookshelf')(knex);

app.set('bookshelf', bookshelf);
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));

/* User Model */
var User = bookshelf.Model.extend({
	tableName: 'users'
});

/* Routes */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/users', function (req, res) {
	new User({
		username: req.body.username,
		email: req.body.email,
		name: req.body.name,
		age: req.body.age,
		location: req.body.location
	}).save()
		.then(function (user) {
			res.json(user);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
});

app.get('/users', function (req, res) {
	new User().fetchAll()
		.then(function (users) {
			res.json(users);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
});

app.delete('/user/:id', function (req, res) {
	var userId = req.params.id;
	new User().where('id', userId)
		.destroy()
		.catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
});

app.get('/user/:id', function (req, res) {
	var userId = req.params.id;
	new User().where('id', userId)
		.fetch()
		.then(function (user) {
			res.json(user);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
});

app.listen(3000, function () {
	console.log('Go to localhost:3000');
});