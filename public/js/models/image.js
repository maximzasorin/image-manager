imageManager
  	.factory('Image', ['$resource', function($resource) {
      	return $resource('/api/v1/images/:imageId', {}, {
        	get: {
        		method: 'GET',
  				transformResponse: function(data) {
  					return angular.fromJson(data).data;
  				}
        	}
      	});
  	}]);