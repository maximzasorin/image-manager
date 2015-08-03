
/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Image schema
 */

var ImageSchema = new Schema({
	album: { type: Schema.ObjectId, ref: 'Album' }
});

/**
 * Methods
 */

ImageSchema.method({

});

/**
 * Register
 */

mongoose.model('Image', ImageSchema);


