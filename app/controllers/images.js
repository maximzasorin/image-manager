
/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var async = require('async');
var multiparty = require('multiparty');
var Album = mongoose.model('Album');
var Image = mongoose.model('Image');

exports.findOne = function(req, res) {
	var imageId = req.params.id;
	Image
		.findOne({ id: imageId })
		.populate({
			path: 'album',
			select: 'id name'
		})
		.exec(function(err, image) {
			if (err) {
				res.sendError(400, err.message);
			} else {
				if (!image) {
					res.sendError(404, 'Image not found.');
				} else {
					image.toJSON({
						callback: function(err, ret) {
							res.send(ret);
						},
						keepAlbum: true
					});
				}
			}
		});
};

exports.findByAlbum = function(req, res) {
	var albumId = req.params.id;
	
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
					async.map(
						album.images
						, function(image, callback) {
							image.toJSON({
								callback: function(err, ret) {
									if (err) {
										callback(err);
									} else {
										callback(null, ret);
									}
								}
							});
						}
						, function(err, images) {
							if (err) {
								res.sendError(400, err.message);
							} else {
								res.send(images);
							}
						}
					);
				}
			}
		});
};

exports.addToAlbum = function(req, res) {
	var albumId = req.params.id;
	Album.findOne({ id: albumId }, function(err, album) {
		if (err) {
			res.sendError(400, err.message);
		} else {
			if (!album) {
				res.sendError(404, 'Album not found.');
			} else {
				var form = new multiparty.Form();
			    form.parse(req, function(err, fields, files) {
			    	if (err) {
				    	res.sendError(err.status, err.message);
				    } else {
				    	var imageFile = files.image;
				    	if (!imageFile) {
				    		res.sendError(400, 'File field not provided.');
				    	} else {
				    		var imagePath = imageFile[0].path;
				    		var image = new Image;
				    		if (!Image.correctExt(imagePath)) {
				    			res.sendError(400, 'Incorrect image extension.');
				    		} else {
				    			image.fromFile(imagePath, function(err) {
				    				if (err) {
				    					res.sendError(400, 'Incorrect image.')
				    				} else {
				    					album.images.push(image);
				    					image.album = album;

				    					album.save(); // callbacks?
				    					image.save();

				    					res.send(image);
				    				}
				    			});
				    		}

				    	}
				    }
				});
			}
		}
	});
};

exports.delete = function(req, res) {
	var imageId = req.params.id;
	
	Image.findOne({ id: imageId }, function(err, image) {
		if (err) {
			res.sendError(400, err.message);
		} else {
			if (!image) {
				res.sendError(404, 'Image not found.');
			} else {
				image.remove(function(err) {
					if (err) {
						res.sendError(404, err.message);
					} else {
						res.send({ success: true, id: imageId});
					}
				});
			}
		}
	});
};

