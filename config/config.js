
/**
 * Expose
 */

module.exports = {
	port: 4000,
	db: 'mongodb://localhost/image-manager-prod',
	publicDir: 'public/',
	image: {
		maxSize: 1024 * 1024, // 1M
		maxWidth: 1200,
		maxHeight: 800,
		extensions: [ 'jpg', 'png' ],
		directory: 'images/'
	},
	archive: {
		maxSize: 10 * 1024 * 1024, // 10M
		extensions: [ 'zip' ]
	}
}


