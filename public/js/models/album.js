imageManager
	.factory('Album', ['$resource', function($resource) {
  		return $resource('/api/v1/albums/:albumId', { albumId: '@id' }, {
    		query: { method: 'GET', isArray: true },
    		update: { method: 'PUT' },
    		remove: { method: 'DELETE' }
  		});
	}]);