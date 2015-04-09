/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport');

var http = require('http');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
var port = process.env.OPENSHIFT_NODEJS_PORT || '8080'
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
//var port = process.env.PORT || 3000;
//app.listen(port);

var server = http.createServer(app);
server.listen(port,ip, function(){
    console.log("Express server listening on port " + port);
});

app.use(express.static(__dirname + '/public'));
// expose app
exports = module.exports = app;