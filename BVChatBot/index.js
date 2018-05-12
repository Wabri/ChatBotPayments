// Express is require to run chat in a local server
// Express (https://expressjs.com/)
// Creation of server
const express = require('express');
const app = express();

// Set workdirectory of app
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname));

// Open port 5000 or the port in dotenv config file
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// When someone send a request to app then send index.html
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// socket connection to socket
io.on('connection', function (socket) {
    // when chat message event catch by socket with text message than do this
    socket.on('chat message', (text) => {
        // print text to console
        console.log('Processing: ' + text);

        // request the text of the APIAI_SESSION_ID
        let request = apiai.textRequest(text, {
            sessionID: process.env.APIAI_SESSION_ID
        });

        // if event catch is response than get the text of response of ai then emit event bot reply with aiText
        request.on('response', (response) => {
            let aiText = response.result.fullfillment.speech;
            socket.emit('bot reply', aiText);
        });

        // if event error catched than print the error in console
        request.on('error', (error) => {
            console.log(error);
        });

        // end the textRequest for this chat message
        request.end();
    });
});