/**
 * Created on Tue Dec 25 09:59:44 2018
 *
 * @author: Elina Liu
 */
require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
const bodyParser = require('body-parser');

const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info'
const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(log4js.connectLogger(logger, { level: logger.level }));
require('./index')(app, server);

// Add your code here

// TODO: All other methods: return 405 errors?
const port = process.env.PORT || localConfig.port;
server.listen(port, function(){
  logger.info(`simple-chat-ai listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`simple-chat-ai listening on http://localhost:${port}`);
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../views', '404.html'));
});

app.use(function (err, req, res, next) {
	res.sendFile(path.join(__dirname, '../views', '500.html'));
});

app.use(express.static(__dirname + '/views'));		// html
app.use(express.static(__dirname + '/public'));		// js, css

module.exports = server;


