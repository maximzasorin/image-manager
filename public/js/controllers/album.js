imageManager
	.controller('AlbumController', ['$scope', '$routeParams', '$location', 'Album', 'Images',
		function($scope, $routeParams, $location, Album, Images) {
			Album.get(
				{ albumId: $routeParams.albumId }
				, function(album) {
					$scope.album = album;
					$scope.images = Images.query(
						{ albumId: $routeParams.albumId }
						, function(images) {
							$scope.images = images;
						}
						, function(data) {
							// error
						}
					);
				}
				, function(xhr) {
					$scope.error = xhr.data;
				}
			);

			$scope.editAlbum = function() {
				$location.path('/albums/' + $scope.album.id + '/edit');
			};

			$scope.deleteAlbum = function(force) {
				if (!force) {
					$('.album-deleting').modal();
				} else {
					Album.remove(
						{ albumId: $scope.album.id }
						, function() {
							$('.album-deleting').modal('hide');

							setTimeout(
								function() {
									$scope.$apply(function() {
										$location.path('/albums');
									});
								}
								, 200
							);
						}
						, function() {
							// error
						}
					);
				}
			};
		}
	]);
