/**
 * Created on Tue Dec 25 09:59:44 2018
 *
 * @author: Elina Liu
 */
require('dotenv').config()
const appName = require('./package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const path = require('path');
const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'info'
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const apiai = require('apiai')(APIAI_TOKEN);

app.use(log4js.connectLogger(logger, { level: logger.level }));

const port = process.env.PORT || 3000;
server.listen(port, function(){
  logger.info(`simple-chat-ai listening on http://localhost:${port}`);
});

app.use(express.static(__dirname + '/public'));		// js, css
app.use(express.static(__dirname + '/views'));		// js, css

app.get('/', function (req, res) {
	res.sendFile('index.html');
})

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '/views', '404.html'));
});

app.use(function (err, req, res, next) {
	res.sendFile(path.join(__dirname, '/views', '500.html'));
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {

    // Get a reply from API.AI

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      socket.emit('bot reply', aiText); // Send the result back to the browser!
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});

module.exports = server;