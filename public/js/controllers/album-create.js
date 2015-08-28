imageManager
	.controller('AlbumCreateController', ['$scope', '$location', 'Album', 'Upload',
		function($scope, $location, Album, Upload) {
			$scope.album = new Album;
			$scope.archive = null;
			
			$scope.uploadProgress = null;
			$scope.lastError = null;

			$scope.createAlbum = function() {
				Upload.upload(
					{
			        	url: '/api/v1/albums',
			            fields: $scope.album,
			            sendFieldsAs: 'form',
			            file: $scope.archive,
			            fileFormDataName: 'archive'
			        }
			    )
			    .progress(
			    	function(evt) {
			        	$scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
		        	}
		        )
		        .success(
		        	function(data, status, headers, config) {
			            $location.path('/albums/' + data.data.id);
			            $scope.uploadProgress = null;			        
		        	}
		        )
		        .error(
		        	function(data, status, headers, config) {
						$scope.lastError = data.message;
			            $scope.uploadProgress = null;
			        }
			    );
			};
		}
	]);
