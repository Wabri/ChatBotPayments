// Express is require to run chat in a local server
// Express (https://expressjs.com/)
// Creation of server
var express = require('express');
var app = express();

// Dotenv loads environment variables from a .env file into process.env.
// Dotenv (https://github.com/motdotla/dotenv)
require('dotenv').config()

// Set workdirectory of app
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/background'));
app.use(express.static(__dirname));

// When someone send a request to app then send index.html
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// Open port 5000 or the port in dotenv config file
const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// API.AI is an ai system for natural language processing, take text and give a
// response
// API.AI (https://github.com/dialogflow/dialogflow-nodejs-client-v2)
const apiai = require('apiai')(process.env.APIAI_TOKEN);

const io = require('socket.io')(server);

// socket connection to socket
io.on('connection', socket => {
    // when chat message event catch by socket with text message than do this
    socket.on('chat message', (message) => {

        // print message on console
        console.log('**** Processing: ' + message + ' ****');

        // request the text of the APIAI_SESSION_ID
        const request = apiai.textRequest(message, {
            sessionId: process.env.APIAI_SESSION_ID
        });

        // if event catch is response than get the text of response of ai then
		// emit event bot reply with aiText
        request.on('response', res => {
            console.log('**** Bot response: ' + res.result.fulfillment.speech + ' ****');
            socket.emit('bot response', res.result.fulfillment.speech);
        });

        // if event error catched than print the error in console
        request.on('error', error => {
            console.log(error);
        });

        // end the textRequest for this chat message
        request.end();
    });
});