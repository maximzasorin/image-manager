imageManager
  .factory('Album', ['$resource', function($resource) {
  		return $resource('/api/v1/albums/:albumId', { albumId: '@id' }, {
  			get: {
  				method: 'GET',
  				transformResponse: function(data) {
  					return angular.fromJson(data).data;
  				}
  			},
    		query: {
    			method: 'GET',
    			isArray: true,
    			transformResponse: function(data) {
    				return angular.fromJson(data).data;
    			}
    		},
    		update: {
                method: 'PUT',
                transformResponse: function(data) {
                    return angular.fromJson(data).data;
                }
            },
    		remove: { method: 'DELETE' }
  		});
	}]);