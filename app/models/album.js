
/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var Decompress = require('decompress');
var recursive = require('recursive-readdir');
var rimraf = require('rimraf');
var path = require('path');
var async = require('async');
var config = require('../../config/config.js');

/**
 * Album schema
 */

var AlbumSchema = new Schema({
	id: { type: String, unique: true, default: shortid.generate },
	name: { type: String, default: 'Unnamed album' },
	createdAt: { type: Date, default: Date.now() },
	saved: { type: Boolean, default: false },
	maxWidth: { type: Number, default: config.image.maxWidth },
	maxHeight: { type: Number, default: config.image.maxHeight },
	images: [
		{
			type: Schema.ObjectId,
			ref: 'Image'
		}
	]
});

/**
 * Middlewares
 */
AlbumSchema.pre('save', function(next) {
	if (this.saved == true) {
		mongoose.model('Album')
			.findOne({ _id: this })
			.populate('images')
			.exec(function(err, album) {
				var i = 0;
				async.each(
					album.images
					, function(image, callback) {
						image.compliesRes(function(err, compliesRes) {
							if (err) {
								callback(new Error('Cannot save. ' + err.message));
							} else {
								if (!compliesRes) {
									callback(new Error('Cannot save. Album have images not complies to resolution.'));
								} else {
									image.isUnique(function(err, isUnique) {
										if (err) {
											callback(new Error('Cannot save. ' + err.message));
										} else {
											if (!isUnique) {
												callback(new Error('Cannot save. Album have not unique images.'));
											} else {
												callback(null);
											}
										}
									});
								}
							}
						});
					}
					, function(err) {
						next(err);
					}
				);
			});
	} else {
		next();
	}
});

AlbumSchema.pre('remove', function(next) {
	mongoose.model('Album')
		.findOne({ _id: this })
		.populate('images')
		.exec(function(err, album) {
			async.each(
				album.images
				, function(image, callback) {
					image.remove(function(err) {
						callback(err);
					});
				}
				, function(err) {
					next(err);
				}
			);
		});
});

/**
 * Statics
 */

AlbumSchema.statics.correctExt = function(archivePath) {
	var extensions = config.archive.extensions;
	var ext = path.extname(archivePath).replace('.', '');

	return (extensions.indexOf(ext) != -1);
};

AlbumSchema.statics.removeDir = function(dirPath) {
	rimraf(dirPath, function(err) {
		if (err) {
			console.error('Can not delete directory', dirPath, '--', err.message);
		} else {
			console.log('Directory', dirPath, 'was removed');
		}
	});
};

/**
 * Methods
 */

AlbumSchema.methods.fromPlain = function(plain) {
	var paths = [ // modified paths
		'name', 'saved', 'maxHeight', 'maxWidth'
	];
	var album = this;

	paths.forEach(function(path) {
		if (plain[path]) {
			album[path] = plain[path];
		}
	});
};

AlbumSchema.methods.parseImages = function(archive, callback) {
	var album = this;

	if (archive.size > config.archive.maxSize) {
		callback({message: 'Too big archive.'});
	} else {
		if (!this.constructor.correctExt(archive.path)) {
			callback({ message: 'Not supported archive type.' })
		} else {
			album.extractArchive(archive, function(err, extractDir) {
				if (err) {
					mongoose.model('Album').removeDir(extractDir);
					callback({ message: 'Can not extract archive.' });
				} else {
					album.pushImages(extractDir, function(err) {
						mongoose.model('Album').removeDir(extractDir);
						if (err) {
							callback({ message: err.message });
						} else {
							if (album.images.length == 0) {
								callback({ message: 'Archive not contain supported images.' })
							} else {
								callback(null);
							}
						}
					});
				}
			});
		}
	}
};

AlbumSchema.methods.extractArchive = function(archive, callback) {
	var archivePath = path.parse(archive.path);
	var archiveName = archivePath.base.replace(archivePath.ext, '');
	var extractDir = archivePath.dir + '/' + archiveName;

	console.log('Extract', archive.path, 'to', extractDir);
	var decompress = new Decompress;

	// only zip while :(
	decompress
		.src(archive.path)
		.dest(extractDir)
		.use(Decompress.zip())
		.run(function(err, files) {
			if (err) {
				callback({ message: 'Can not decompress archive.' })
			} else {
				callback(null, extractDir);
			}
		});
};

AlbumSchema.methods.pushImages = function(dirname, callback) {
	var album = this;

	recursive(dirname, function(err, files) {
		if (err) {
			callback({ message: err.message });
		} else {
			async.each(
				files
				, function(filePath, callback) {
					var Image = mongoose.model('Image');
					if (Image.correctExt(filePath)) {
						var image = new Image;
						image.album = album;

						image.fromFile(filePath, function(err) {
							if (err) {
								// incorrect image file
								callback();
							} else {
								image.save(); // callback?
								album.images.push(image);
								callback();
							}
						});
					} else {
						// not image
						callback();
					}
				}
				, function(err) {
					if (err) {
						callback({ message: err.message });
					} else {
						callback(null);
					}
				}
			);
		}
	});	
};

AlbumSchema.options.toJSON = {
    transform: function(doc, ret, options) {
    	if (ret.images) {
    		ret.countImages = ret.images.length;
    	}
    	delete ret.images;
    	
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};


/**
 * Register
 */

mongoose.model('Album', AlbumSchema);


