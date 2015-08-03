
/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');

var config = require('./config/config.js');
var app = express();

// Connect to mongo
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap application settings
require('./config/express.js')(app);

// Bootstrap routes
require('./config/routes.js')(app);

app.listen(config.port);
console.log('Express app started on port ' + config.port);


