var Model = require('./../models/user');

/* Route for saving a user */
var saveUser = function (req, res) {
	new Model.User({
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
};

/* Route to get all users */
var getAllUsers = function (req, res) {
	new Model.User().fetchAll()
		.then(function (users) {
			res.json(users);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Route to delete a user */
var deleteUser = function (req, res) {
	var userId = req.params.id;
	new Model.User().where('id', userId)
		.destroy()
		.catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Route to get a user */
var getUser = function (req, res) {
	var userId = req.params.id;
	new Model.User().where('id', userId)
		.fetch()
		.then(function (user) {
			res.json(user);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Export all routes */
module.exports = {
	saveUser: saveUser,
	getAllUsers: getAllUsers,
	deleteUser: deleteUser,
	getUser: getUser
};
