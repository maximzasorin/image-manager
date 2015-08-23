var imageManager = angular.module('imageManager', ['ngRoute', 'ngResource', 'ngFileUpload'])
	.config(['$routeProvider', 
		function($routeProvider) {
			$routeProvider.
				// Albums
				when('/albums', {
					templateUrl: '/js/views/album-list.html',
					controller: 'AlbumListController'}).
				when('/albums/create', {
					templateUrl: '/js/views/album-create.html',
					controller: 'AlbumCreateController'}).
				when('/albums/:albumId', {
					templateUrl: '/js/views/album.html',
					controller: 'AlbumController'}).
				when('/albums/:albumId/edit', {
					templateUrl: '/js/views/album-edit.html',
					controller: 'AlbumEditController'}).

				// Images
				when('/images/:imageId', {
					templateUrl: '/js/views/image.html',
					controller: 'ImageController'}).

				// dafault
				otherwise({
					redirectTo: '/albums'
				});
		}
	]);