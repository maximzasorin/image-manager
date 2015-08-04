
/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var Decompress = require('decompress');
var recursive = require('recursive-readdir');
var path = require('path');
var async = require('async');
var config = require('../../config/config.js');

/**
 * Album schema
 */

var AlbumSchema = new Schema({
	id: { type: String, unique: true, default: shortid.generate },
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now() },
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
 * Statics
 */
AlbumSchema.statics.correctExt = function(archivePath) {
	var extensions = config.archive.extensions;
	var ext = path.extname(archivePath).replace('.', '');

	return (extensions.indexOf(ext) != -1);
};

/**
 * Methods
 */

AlbumSchema.methods.parseImages = function(archive, callback) {
	var album = this;

	if (archive.size > config.archive.maxSize) {
		callback({message: 'Too big archive.'});
	} else {
		if (!this.constructor.correctExt(archive.path)) {
			callback({ message: 'Not supported archive type.' })
		} else {
			album.extractArchive(archive, function(err, dirname) {
				if (err) {
					// remove directory
					callback({ message: 'Can not extract archive.' });
				} else {
					album.pushImages(dirname, function(err) {
						// remove directory
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

	console.log(archive.path, 'to', extractDir);
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
						image.fromFile(filePath, function(err) {
							if (err) {
								// incorrect image file
								callback();
							} else {
								image.save();
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
    	ret.countImages = ret.images.length;
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


