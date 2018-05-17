var $window = $(window);
var $inputMessage = $('.inputMessage'); // input box message
var $messages = $('.messages');

// SpeechRecognition is the controller interface of the web speech api for voice recognition
// SpeechRecognition (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// Properties of recognition
recognition.lang = 'it-IT';
recognition.interimResults = false;

// Using Socket.io for bidirectional communication between web clients and servers
// Socket.io (https://socket.io/)
var socket = io();

// When recognition produce a result we can catch this event with this
recognition.addEventListener('result', e => {
    var message = e.result[0][0].transcript;

    socket.emit('chat message', message);
});

// this function create a audio with the voice synth of the text  
function synthVoice(text) {
    const synth = window.speechSynthesis;
    // The SpeechSynthesisUtterance interface of the Web Speech API represents a speech request. 
    // It contains the content the speech service should read and information about how to read it.
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.text = text + ' wow!';
    synth.speak(utterance);
}

// when bot reply event catch let's produce text audio
socket.on('bot reply', (botMessage) => {
    var who = 'bot';
    addChatMessage(botMessage, who);
    synthVoice(botMessage)
});

// when the client hits ENTER on their keyboard
$window.keydown(event => {
    if (event.witch === 13) {
        sendMessage();
    }
})

// get the text message from inputMessage box
const sendMessage = () => {
    var message = $inputMessage.val();
    message = $('<div/>').text(input).html();
    addChatMessage(message);
    socket.emit('chat message', message);
}

// create the element message to put in the chatbox
const addChatMessage = (message) => {
    var $usernameDiv = $('<span class="username"/>');
    var $messageBodyDiv = $('<span class="messageBody">').text(message);
    var $messageDiv = $('<li class="message"/>')
        .data('username', '')
        .addClass(typingClass)
        .append($messageDiv, $messageBodyDiv);
    addMessageElement($messageDiv);
}

// get the element to put in the chatbox
const addMessageElement = (element) => {
    var $element = $(element);
    $element.hide().fadeIn(150);
    $messages.append($element);
    $messages[0].scrollTop = $messages[0].scrollHeight;
}