
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
				res.error(err.message);
			} else {
				if (!image) {
					res.error('Image not found.');
				} else {
					image.toJSON({
						callback: function(err, ret) {
							res.success(ret);
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
				res.error(err.message)
			} else {
				if (!album) {
					res.error('Album not found.', 404);
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
								res.error(err.message);
							} else {
								res.success(images);
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
			res.error(err.message);
		} else {
			if (!album) {
				res.error('Album not found.', 404);
			} else {
				var form = new multiparty.Form();
			    form.parse(req, function(err, fields, files) {
			    	if (err) {
				    	res.error(err.message, err.status);
				    } else {
				    	var imageFile = files.image;
				    	if (!imageFile) {
				    		res.error('File field not provided.');
				    	} else {
				    		var imagePath = imageFile[0].path;
				    		var image = new Image;
				    		if (!Image.correctExt(imagePath)) {
				    			res.error('Incorrect image extension.');
				    		} else {
				    			image.fromFile(imagePath, function(err) {
				    				if (err) {
				    					res.error('Incorrect image.')
				    				} else {
				    					album.images.push(image);
				    					image.album = album;

				    					album.save(); // callbacks?
				    					image.save();

				    					res.success(image);
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
			res.error(err.message);
		} else {
			if (!image) {
				res.error('Image not found.', 404);
			} else {
				image.remove(function(err) {
					if (err) {
						res.error(err.message, 404);
					} else {
						res.success({ id: imageId });
					}
				});
			}
		}
	});
};

