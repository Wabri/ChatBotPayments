// Express is require to run chat in a local server
// Express (https://expressjs.com/)
// Creation of server
var express = require('express');
var app = express();

// Dotenv loads environment variables from a .env file into process.env.
// Dotenv (https://github.com/motdotla/dotenv)
require('dotenv').config()

// Set workdirectory of app
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/src/view'));

// When someone send a request to app then send index.html
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// Open port 5000 or the port in dotenv config file
const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// API.AI is an ai system for natural language processing, take text and give a response
// API.AI (https://github.com/dialogflow/dialogflow-nodejs-client-v2)
const apiai = require('apiai')(process.env.APIAI_TOKEN);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    // event 'chat message' catch from socket
    socket.on('chat message', (message) => {
        // print message on console
        console.log('Ricevuto un messaggio utente: ' + message);
        // request the text of the APIAI_SESSION_ID
        const apiaiRequest = apiai.textRequest(message, {
            sessionID: process.env.APIAI_SESSION_ID
        });
        // request bot reply
        apiaiRequest.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            console.log('Risposta bot: ' + aiText);
            socket.emit('bot reply', aiText);
        });
        // if event error catched than print the error in console
        apiaiRequest.on('error', error => {
            console.log(error);
        });
        // end the textRequest for this chat message
        apiaiRequest.end();
    });
    // event 'connect' catch from socket
    socket.on('connect', () => {
        console.log('Utente connesso');
        var $welcomeMessage = "Salve";
        socket.emit('bot reply', $welcomeMessage);
    });
    // event 'disconnect' catch from socket
    socket.on('disconnect', () => {
        console.log('Utente disconnesso');
    });
});