
/**
 * Module dependencies
 */

var imagemagick = require('imagemagick');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var randomstring = require('randomstring');
var config = require('../../config/config.js');

/**
 * Image schema
 */

var ImageSchema = new Schema({
	album: { type: Schema.ObjectId, ref: 'Album' },
	createdAt: { type: Date, default: Date.now() },
	// compliesRes: { type: Boolean, default: true },
	uniqueImage: { type: Boolean, default: true },
	hash: { type: String },
	width: { type: Number },
	height: { type: Number },
	path: { type: String }
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
	var stream = fs.createReadStream(filePath);
	var hash = crypto.createHash('sha1');
	hash.setEncoding('hex');

	stream.on('error', function(err) {;
		callback({ message: err.message });
	})
	
	stream.on('end', function() {
	    hash.end();
	    callback(null, hash.read());
	});

	stream.pipe(hash)
};

/**
 * Methods
 */

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
							mongoose.model('Image').findOne({ hash: hash }, function(err, another) {
								if (another) {
									image.uniqueImage = false;
								}
								callback(null);
							});
						}
					});
				}
			});			
		}
	});
};

ImageSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/**
 * Register
 */

mongoose.model('Image', ImageSchema);


