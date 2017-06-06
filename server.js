'use strict';

//Set up global variables
var port = process.env.PORT || 8000;
var dataFile = './data/assets.json';

//Set up npm modules
var fs = require('fs');
var jp = require('jsonpath')
var express = require('express');
var app = express();

//Set up npm modules for Swagger UI
var swaggerUi = require('swaggerize-ui');

//Endpoint to get assets for all products
app.get('/assets', function(req, res) {
	fs.readFile(dataFile, 'utf8', function(err, data){
		res.end(data);
	});
})

//Endpoint to get assets for a given GTIN
app.get('/assets/:gtin', function(req, res) {
	fs.readFile(dataFile, 'utf8', function(err, data){
		var assets = JSON.parse(data);
		var asset = jp.query(assets, '$..[?(@.gtin==' + req.params.gtin + ')]');
		res.end(JSON.stringify(asset));
	});
})

//Endpoint to get Swagger API specification
app.get('/swagger', function(req, res) {
	fs.readFile('./docs/swagger.json', 'utf8', function(err, data){
		res.end(data);
	});
})

//Endpoint for Swagger UI
app.use('/docs', swaggerUi({
  docs: '/swagger'
}));

//Start the web server and listen for requests
var server = app.listen(port, function () {
	var host = server.address().address
	var port = server.address().port
	
	console.log("Product Assets service listening at http://%s:%s", host, port)
});
