imageManager
	.controller('AlbumListController', ['$scope', '$routeParams', 'Album',
		function($scope, $routeParams, Album) {
			$scope.albums = Album.query();
		}
	]);
