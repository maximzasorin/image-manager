imageManager
  	.factory('Image', ['$resource', function($resource) {
      	return $resource('/api/v1/images/:imageId', {}, {
        	query: { method: 'GET', params: { imageId: '' }, isArray: true }
      	});
  	}]);