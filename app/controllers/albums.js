
/**
 * Module dependencies
 */

var multiparty = require('multiparty');
var mongoose = require('mongoose');
var config = require('../../config/config.js');
var Album = mongoose.model('Album');

exports.findAll = function(req, res) {
	Album.find({}, function(err, albums) {
		if (err) {
			res.sendError(400, err.message);
		} else {
			res.send(albums);
		}
	});
};

exports.findOne = function(req, res) {
	var albumId = req.params.id;
	Album
		.findOne({ id: albumId })
		.populate('images')
		.exec(function(err, album) {
			if (err) {
				res.sendError(400, err.message);
			} else {
				if (!album) {
					res.sendError(404, 'Album not found.');
				} else {
					res.send(album);
				}
			}
		});
};

exports.post = function(req, res) {
	var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
    	if (err) {
	    	res.sendError(err.status, err.message);
	    } else {
	    	var archive = files.archive;
	    	var name = fields.name;

	    	if (!archive) {
		    		res.sendError(400, 'File field not provided.');
	    	} else {
		    	if (!name) {
		    		res.sendError(400, 'Name of album is required.');
		    	} else {
	    			var album = new Album;
	    			album.name = name;
	    			album.parseImages(archive[0], function(err) {
	    				// remove archive
	    				if (err) {
		    				res.sendError(400, err.message);
			    		} else {
			    			album.save(function(err) {
			    				if (err) {
			    					res.sendError(400, err.message);
			    				} else {
			    					res.send(album);
			    				}
			    			});
			    		}
	    			});
		    	}
		    }
	    }
    });
};


