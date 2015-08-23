imageManager
	.controller('AlbumEditController', ['$scope', '$routeParams', 'Album', 'Images',
		function($scope, $routeParams, Album, Images) {
			var objectId = { albumId: $routeParams.albumId };

			$scope.album = Album.get(objectId);
			$scope.images = Images.query(objectId);

			$scope.saveAlbum = function() {
				Album.update($scope.album, function() {
					$scope.images = Images.query(objectId); // update images
				});
			};
		}
	]);
