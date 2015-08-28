
/**
 * Module dependencies
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var middlewares = require('./middlewares.js');

/**
 * Expose
 */

module.exports = function(app) {
	app.use(middlewares.jsend);

	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());

	app.set('views', __dirname + '/../app/views');
	app.set('view engine', 'ejs');

	app.use(express.static(__dirname + '/../public'));
	app.use('/bower_components',  express.static(__dirname + '/../bower_components'));
}


