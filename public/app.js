'use strict';

angular.module('simpleBookshelfApp', ['ngResource', 'ngRoute'])
	.config(function ($routeProvider, $httpProvider) {

		$routeProvider.when('/user-list', {templateUrl: 'public/userList.html', controller: 'UserCtrl'});
		$routeProvider.when('/add-user', {templateUrl: 'public/addUser.html', controller: 'UserCtrl'});
		$routeProvider.when('/user-details/:id', {
			templateUrl: 'public/userDetails.html',
			controller: 'UserDetailsCtrl'
		});
		$routeProvider.otherwise({redirectTo: '/user-list'});
	})
	.factory('UsersFactory', function ($resource) {
		return $resource('/users', {}, {
			addUser: {method: 'POST'},
			listUsers: {method: 'GET', isArray: true}
		})
	})
	.factory('UserFactory', function ($resource) {
		return $resource('/user/:id', {}, {
			deleteUser: {method: 'DELETE', params: {id: '@id'}},
			userDetails: {method: 'GET', params: {id: '@id'}}
		})
	})
	.controller('UserCtrl', ['$scope', 'UserFactory', 'UsersFactory', '$location',
		function ($scope, UserFactory, UsersFactory, $location) {
			$scope.addNewUser = function () {
				UsersFactory.addUser($scope.user);
				$location.path('/user-list');
			};

			$scope.deleteUser = function (userId) {
				UserFactory.deleteUser({id: userId});
				$scope.users = UsersFactory.listUsers();
			};

			$scope.users = UsersFactory.listUsers();

		}])
	.controller('UserDetailsCtrl', ['$scope', '$routeParams', 'UsersFactory', '$location',
		function ($scope, $routeParams, UserFactory, $location) {
			$scope.userDetails = function () {
				$location.path('/user-details');
			};
			$scope.user = UserFactory.userDetails({id: $routeParams.id});


		}]);
