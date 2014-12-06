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

module.exports.bookshelf = bookshelf;
