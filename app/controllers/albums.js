
/**
 * Module dependencies
 */

var multiparty = require('multiparty');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('../../config/config.js');
var Album = mongoose.model('Album');

exports.findAll = function(req, res) {
	Album.find({}, function(err, albums) {
		if (err) {
			res.error(err.message);
		} else {
			res.success(albums);
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
				res.error(err.message);
			} else {
				if (!album) {
					res.error('Album not found.', 404);
				} else {
					res.success(album);
				}
			}
		});
};

exports.post = function(req, res) {
	var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
    	if (err) {
	    	res.error(err.message, err.status);
	    } else {
	    	var archive = files.archive;

	    	if (!archive) {
		    		res.error('File field not provided.');
	    	} else {
    			var album = new Album;
    			album.fromPlain(fields);
    			
    			album.parseImages(archive[0], function(err) {
    				fs.unlink(archive[0].path, function(err) {
    					if (err) {
    						console.error('Can not remove file', archive[0].path, '--', err.message);
    					} else {
    						console.log('File', archive[0].path, 'was removed');
    					}
    				});

    				if (err) {
	    				res.error(err.message);
		    		} else {
		    			album.save(function(err) {
		    				if (err) {
		    					res.error(err.message);
		    				} else {
		    					res.success(album);
		    				}
		    			});
		    		}
    			});
		    }
	    }
    });
};

exports.put = function(req, res) {
	var albumId = req.params.id;

	Album.findOne({ id: albumId }, function(err, album) {
		if (err) {
			res.error(err.message);
		} else {
			if (!album) {
				res.error('Album not found.');
			} else {
				album.fromPlain(req.body);
				album.save(function(err) {
					if (err) {
						res.error(err.message);
					} else {
						res.success(album);
					}
				});
			}
		}
	});
};

exports.delete = function(req, res) {
	var albumId = req.params.id;
	Album.findOne({ id: albumId }, function(err, album) {
		if (err) {
			res.error(err.message);
		} else {
			if (!album) {
				res.error('Album not found.');
			} else {
				album.remove(function(err) {
					if (err) {
						res.error(err.message);
					} else {
						res.success({ id: albumId });
					}
				});
			}
		}
	});
};


