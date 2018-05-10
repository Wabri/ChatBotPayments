// SpeechRecognition is the controller interface of the web speech api for voice recognition
// SpeechRecognition (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Now use Socket.io for bidirectional communication between web clients and servers
// Socket.io (https://socket.io/)
const socket = io();

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
    let text = e.result[last][0].transcript;  // transform the audio result in text

    console.log('Confidence: ' + e.result[0][0].confidence);

    // socket.emit register a new handler (text) for the given event ('chatMessage')
    socket.emit('chatMessage', text);
});














