
/**
 * Module dependencies
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

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

	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());

	app.use(express.static(path.normalize(__dirname + '/../public')));
}


