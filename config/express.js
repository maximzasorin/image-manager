
/**
 * Module dependencies
 */

var express = require('express');
var path = require('path');

/**
 * Expose
 */

module.exports = function(app) {
	app.use(function(req, res, next) {
		res.sendError = function(status, message) {
			this.status(status).send({
				status: status,
				message: message
			});
		}

		next();
	});

	console.log(path.normalize(__dirname + '/../public'));

	app.use(express.static(path.normalize(__dirname + '/../public')));
}


