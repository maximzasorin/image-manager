
/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Album schema
 */

var AlbumSchema = new Schema({
	name: { type: String, default: '' },
	createdAt: {type: Date, default: Date.now() },
	images: [{ type: Schema.ObjectId, ref: 'Image' }]
});

/**
 * Methods
 */

AlbumSchema.method({

});

/**
 * Register
 */

mongoose.model('Album', AlbumSchema);


