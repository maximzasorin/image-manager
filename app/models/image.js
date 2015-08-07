
/**
 * Module dependencies
 */

var imagemagick = require('imagemagick');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var fs = require('fs');
var async = require('async');
var crypto = require('crypto');
var path = require('path');
var randomstring = require('randomstring');
var config = require('../../config/config.js');

/**
 * Image schema
 */

var ImageSchema = new Schema({
	id: { type: String, unique: true, default: shortid.generate },
	createdAt: { type: Date, default: Date.now() },
	// compliesRes: { type: Boolean, default: true },
	// uniqueImage: { type: Boolean, default: true },
	hash: { type: String },
	width: { type: Number },
	height: { type: Number },
	path: { type: String },
	album: { type: Schema.ObjectId, ref: 'Album', index: true }
});

/**
 * Middlewares
 */

ImageSchema.post('remove', function() {
	var imagePath = config.publicDir + this.path;
	fs.unlink(imagePath, function(err) {
		if (err) {
			console.log('Can not remove file', imagePath, '--', err.message);
		} else {
			console.log('File', imagePath, 'was removed');
		}
	});
});

/**
 * Statics
 */

ImageSchema.statics.correctExt = function(filePath) {
	var extensions = config.image.extensions;
	var ext = path.extname(filePath).replace('.', '');

	return (extensions.indexOf(ext) != -1);
};

ImageSchema.statics.uniqueName = function(filePath) {
	var publicDir = config.publicDir + config.image.directory;
	var ext = path.extname(filePath);
	
	var fileName = publicDir + randomstring.generate() + ext;
	while (fs.existsSync(fileName)) {
		fileName = publicDir + randomstring.generate() + ext;
	}

	return fileName;
};

ImageSchema.statics.copyFile = function(filePath, callback) {
	var fileName = mongoose.model('Image').uniqueName(filePath);

	fs.createReadStream(filePath)
		.pipe(fs.createWriteStream(fileName))
		.on('error', function(err) {
			callback(err);
		})
		.on('open', function() {
			callback(null, fileName);
		});
};

ImageSchema.statics.hashFile = function(filePath, callback) {
	var shasum = crypto.createHash('sha256');

	var s = fs.ReadStream(filePath);
	s.on('data', function(d) {
	  	shasum.update(d);
	});

	s.on('end', function() {
		var d = shasum.digest('hex');
		callback(null, d);
	});
};

/**
 * Methods
 */
ImageSchema.methods.compliesRes = function(callback) {
	mongoose.model('Image')
		.findOne({ _id: this})
		.populate('album')
		.exec(function(err, image) {
			if (err) {
				callback(err);
			} else {
				var compliesRes = image.width <= image.album.maxWidth
								&& image.height <= image.album.maxHeight;

				callback(null, compliesRes);
			}
		});
};

ImageSchema.methods.isUnique = function(callback) {
	var image = this;
	mongoose.model('Image')
		.findOne(
			{
				_id: { $ne: image._id },
				hash: image.hash
			}
			, function(err, another) {
				if (err) {
					callback(err)
				} else {
					callback(null, (another == null));
				}
			}
		);
};

ImageSchema.methods.fromFile = function(filePath, callback) {
	var image = this;

	imagemagick.identify(filePath, function(err, features) {
		if (err) {
			callback({ message: err.message });
		} else {
			image.width = features.width;
			image.height = features.height;

			mongoose.model('Image').copyFile(filePath, function(err, fileName) {
				if (err) {
					callback({ message: err.message });
				} else {
					image.path = fileName.replace(config.publicDir, '');
					mongoose.model('Image').hashFile(fileName, function(err, hash) {
						if (err) {
							callback({ message: err.message });
						} else {
							image.hash = hash;
							callback(null);
						}
					});
				}
			});			
		}
	});
};

ImageSchema.options.toJSON = {
    transform: function(doc, ret, options) {
    	delete ret.album;
		delete ret._id;
	    delete ret.__v;

    	if (options.callback) {
    		async.parallel(
    			[
	    			function(callback) {
	    				doc.isUnique(function(err, isUnique) {
			    			if (err) {
			    				callback(err);
			    			} else {
			    				ret.isUnique = isUnique;
			    				callback(null);
			    			}
		    			});
		    		}
	    			, function(callback) {
	    				doc.compliesRes(function(err, compliesRes) {
	    					if (err) {
	    						options.callback(err);
	    					} else {
	    						ret.compliesRes = compliesRes;
	    						callback(null);
	    					}
	    				});
	    			}
	    		]
	    		, function(err) {
	    			options.callback(err, ret);
	    		}
    		);
    	}
    }
};

/**
 * Register
 */

mongoose.model('Image', ImageSchema);


