
/**
 * Module dependencies
 */

var express = require('express')
var api = express.Router();

var home = require('../app/controllers/home.js');
var albums = require('../app/controllers/albums.js');
var images = require('../app/controllers/images.js');

/**
 * Expose
 */

module.exports = function(app) {
	app.get('/', home.index);

	// API
	api.get('/albums', albums.findAll);
	api.get('/albums/:id', albums.findOne);
	api.get('/albums/:id/images', images.findByAlbum);
	api.post('/albums/:id/images', images.addToAlbum);
	api.post('/albums', albums.post);
	api.put('/albums/:id', albums.put);
	api.delete('/albums/:id', albums.delete);

	api.get('/images/:id', images.findOne);
	api.delete('/images/:id', images.delete);

	app.use('/api/v1', api);
}


