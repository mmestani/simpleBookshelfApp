var bookshelf = require('./../config/db').bookshelf;

var User = bookshelf.Model.extend({
	tableName: 'users'
});

module.exports = {
	User: User
};
