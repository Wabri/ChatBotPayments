// SpeechRecognition is the controller interface of the web speech api for voice recognition
// SpeechRecognition (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Now use Socket.io for bidirectional communication between web clients and servers
// Socket.io (https://socket.io/)
const socket = io();

// Dotenv loads environment variables from a .env file into process.env.
// Dotenv (https://github.com/motdotla/dotenv)
require('dotenv').config()

// API.AI is an ai system for natural language processing, take text and give a response
// API.AI (https://github.com/dialogflow/dialogflow-nodejs-client-v2)
const apiai = require('aiai')(process.env.APIAI_TOKEN); // this was not configure yet


// Properties of recognition
recognition.lang = 'it-IT';
recognition.interimResults = false;

// This is the interaction with button in index.html
document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});

// When recognition produce a result we can catch this event with this
recognition.addEventListener('result', (e) => {
    let last = e.result.length - 1; // catch the length the result
    let text = e.result[last][0].transcript; // transform the audio result in text

    console.log('Confidence: ' + e.result[0][0].confidence); // print to console the confidence text

    // socket.emit register a new handler (text) for the given event ('chatMessage')
    socket.emit('chat message', text);
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

// this function create a audio with the voice synth of the text  
function synthVoice(text) {
    const synth = window.speechSynthesis;
    //The SpeechSynthesisUtterance interface of the Web Speech API represents a speech request. 
    // It contains the content the speech service should read and information about how to read it.
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text + ' wow!';
    synth.speak(utterance);
}

// when bot reply event catch let's produce text audio reply
socket.on('bot reply', function(replyText) {
  synthVoice(replyText);
});
