imageManager
	.factory('Images', ['$resource', function($resource) {
  		return $resource('/api/v1/albums/:albumId/images', {}, {
    		query: {
    			method: 'GET',
    			params: { albumId: '' },
    			isArray: true,
  				transformResponse: function(data) {
  					return angular.fromJson(data).data;
  				}
    		}
  		});
	}]);