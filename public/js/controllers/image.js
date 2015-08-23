imageManager
	.controller('ImageController', ['$scope', '$routeParams', 'Image',
		function($scope, $routeParams, Image) {
			$scope.image = Image.get({ imageId: $routeParams.imageId });
		}
	]);
