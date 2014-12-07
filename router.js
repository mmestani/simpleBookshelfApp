var user = require('./routes/users');
var index = require('./routes/index');

module.exports = function (app) {

	/* Index(main) route */
	app.get('/', index.index);

	/* User Routes */
	app.post('/users', user.saveUser);
	app.get('/users', user.getAllUsers);
	app.delete('/user/:id', user.deleteUser);
	app.get('/user/:id', user.getUser);
};

