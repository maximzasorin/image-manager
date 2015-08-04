
/**
 * Module dependencies
 */

var home = require('../app/controllers/home.js');
var albums = require('../app/controllers/albums.js');
var images = require('../app/controllers/images.js');

/**
 * Expose
 */

module.exports = function(app) {
	app.get('/', home.index);

	// API
	app.get('/albums', albums.findAll);
	app.get('/albums/:id', albums.findOne);
	app.get('/albums/:id/images', images.findByAlbum);
	app.post('/albums', albums.post);
}


