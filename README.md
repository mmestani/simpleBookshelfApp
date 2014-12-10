Simple Application that uses Node.js(Express) and Bookshelf.js ORM
==================================================================
<h3>Description</h3>
---------------------
This is a simple application that implements bookshelf.js JavaScript ORM(Object Relational Mapping) with Node.js

There is included an example that create, list, delete and list details of an user.

<h3>File Structure</h3>
-----------------------
    simpleBookshelfApp/                 - Location for simpleBookshelfApp specific files.
    simpleBookshelfApp/config/          - Location for configuration files.
    simpleBookshelfApp/config/db.js     - Database configuratin file.
    simpleBookshelfApp/models/          - Location for Models.
    simpleBookshelfApp/models/User.js   - User model file.
    simpleBookshelfApp/public/          - Location for all client-side code (views, assets(js, css etc))
    simpleBookshelfApp/routes/          - Location for application logic.
    simpleBookshelfApp/routes/index.js  - Main source 
    simpleBookshelfApp/routes/users.js  - User logic.
    simpleBookshelfApp/router.js        - Application router.
    package.json                        - npm package descriptor.
    server.js                           - Main application file.
    README.md                           - This file.
    
<h3>Packages (package.json)</h3>
---------------------------------------------------
  This store node modules dependencies used in application.
  
      express(v4.10.4)       - This package is a MVC framework for Node.js
      bookshelf(v0.4.9)      - This package is javascript ORM for Node.js
      knex(v0.7.3)           - This package is for SQL Query Builder for Postgrate, MySQL etc.
      mysql(v2.5.3)          - This package is a MySQL driver for Node.js
      body-parse(v1.10.0)    - This package is a Node.js body parser
      path(v0.4.9)           - This package is a Node.js path module
     
  All these package are installed by ```npm```(Node Package Manager). You have to type ```npm install``` at directory package.json is stored and all packages will be installed automatically. 
  
<h3>Code description</h3>
-------------------------
1. In the ```config/db.js``` is stored database configuration,
  
      First, there is declared an object ```DBConfig```, in this object are stored data for database client and database options
    
      ```javascript
      var DBConfig = {
    	client: 'mysql',
    	connection: {
    		host: 'localhost',
    		user: 'root',
    		password: 'mysql_password',
    		database: 'database_name',
    		charset: 'utf8'
    	}
    };
    ```
    Then, there is included ```knex``` package passing ```DBConfig``` object, after that there is included ```bookshelf``` package passing ```knex```
    ```javascript
    var knex = require('knex')(DBConfig);
    var bookshelf = require('bookshelf')(knex);
    ```
    
    And finally, is exported ```bookshelf``` and we are done with ```config/db.js``` file.
    ```javascript
    module.exports.bookshelf = bookshelf;
    ```

2. Let's describe next file ```models/User.js```

    First, is included ```bookshelf``` that we exported above
    
    ```javascript
    var bookshelf = require('./../config/db').bookshelf;
    ```
    Then,is declared a ```User``` object that extends built-in ```bookshelf Model``` with a table name, in this case ```users``` table
    
    ```javascript
    var User = bookshelf.Model.extend({
    	tableName: 'users'
    });
    ```
    Finally, export ```User``` and we are done with model.
    ```javascript
    module.exports = {
    	User: User
    };
    ```

3. The directory ```routes``` contains two files: ```index.js``` and ```users.js```.

    In index.js, first is included ```path``` package needed resolve relative path. Then, we export the main view file (index.html).
    ```javascript
    var path = require('path');
    
    var index = function (req, res) {
    	res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    };
    
    module.exports.index = index;
    ```
    
    Code below belongs to ```users.js``` file. First of all, there is included User model.
    To save a user, inputs are set by a request from client side, and with ```save``` method of ```bookshelf``` it is saved to db. If it will be saved, ```then``` method repond user as ```json```, othervise it fires and error.
    
    ```javascript
    var Model = require('./../models/User');
    
    /* Save a user */
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
    			res.json(error);
    		});
    };
    ```
    
    Below are returnded all users from database, useing another method of ```bookshelf - fetchAll()```. 
    ```javascript
    /* Get all users */
    var getAllUsers = function (req, res) {
    	new Model.User().fetchAll()
    		.then(function (users) {
    			res.json(users);
    		}).catch(function (error) {
    			res.json(error);
    		});
    };
    ```
    
    First, this get the user id from url parameters and then using ```destroy``` method, it deletes the user in database.
    ```javascript
    /* Delete a user */
    var deleteUser = function (req, res) {
    	var userId = req.params.id;
    	new Model.User().where('id', userId)
    		.destroy()
    		.catch(function (error) {
    			res.json(error);
    		});
    };
    ```
    
    The code below gets all details for a specified user.
    ```javascript
    /* Get a user */
    var getUser = function (req, res) {
    	var userId = req.params.id;
    	new Model.User().where('id', userId)
    		.fetch()
    		.then(function (user) {
    			res.json(user);
    		}).catch(function (error) {
    			res.json(error);
    		});
    };
    ```
    
    Using ```module.export``` it exports all methods explained above.
    ```javascript
    /* Exports all methods */
    module.exports = {
    	saveUser: saveUser,
    	getAllUsers: getAllUsers,
    	deleteUser: deleteUser,
    	getUser: getUser
    };
    ```

4. router.js

    This is router. It included logic from routes collection and uses methods from these routes, and at least it export url routes for basic http methods using expressjs. This method will be used to ```server.js```
    
    ```javascript
    
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
    ```

5. server.js

    Here the server is started and the routes are called. The ```express``` framework and ```body-parser``` are included. ```body-parser``` is used to parse ```json```.
    
    ```javascript
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
    ```
    
Finally the simple app is done. Enjoy it!
