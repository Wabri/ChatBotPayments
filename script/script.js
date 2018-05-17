var $inputMessage = $('.inputMessage'); // Input message input box
var $messages = $('.messages'); // Messages area
var $chatPage = $('.chat.page'); // The chat page


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
const apiai = require('aiai')(process.env.APIAI_TOKEN);

// this is use to modify the field .output-you and .output-bot implemented in the index.html
const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

// Properties of recognition
recognition.lang = 'it-IT';
recognition.interimResults = false;

// This is the interaction with button in index.html
document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});

// When recognition produce a result we can catch this event with this
recognition.addEventListener('result', (e) => {
    console.log('Result has been detected.');

    let last = e.result.length - 1; // catch the length the result
    let text = e.result[last][0].transcript; // transform the audio result in text

    console.log('Confidence: ' + e.result[0][0].confidence); // print to console the confidence text

    // socket.emit register a new handler (text) for the given event ('chatMessage')
    socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    outputBot.textContent = 'Error: ' + e.error;
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
socket.on('bot reply', function (replyText) {
    synthVoice(replyText);
});

const sendMessage = () => {
    var message = $inputMessage.val();
    message.cleenInput(message);

    socket.emit('chat message', message);
}

const cleanInput = (input) => {
    return $('<div/>').text(input).html();
}

const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el);
}

const addMessageElement = (el) => {
    var $el = $(el);
    $messages.hide().fadeIn(150);
    $messages.append($el);
    $messages[0].scrollTop = $messages[0].scrollHeight;
}

const addChatMessage = (data, options) => {
    var $typingMessages = getTypingMessages(data);

    var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
}