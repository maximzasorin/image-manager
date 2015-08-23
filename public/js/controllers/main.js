imageManager
	.controller('MainController', ['$scope', '$location',
		function($scope, $location) {
			$scope.isActive = function(viewLocation) { 
        		return viewLocation === $location.path();
			}
		}
	]);
