
/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var Album = mongoose.model('Album');
// var Image = mongoose.model('Image');

exports.findByAlbum = function(req, res) {
	var albumId = req.params.id;
	console.log(albumId);

	Album
		.findOne({ id: albumId })
		.populate('images')
		.exec(function(err, album) {
			if (err) {
				res.sendError(400, err.message)
			} else {
				if (!album) {
					res.sendError(404, 'Album not found.');
				} else {
					res.send(album.images);
				}
			}
		});
}


