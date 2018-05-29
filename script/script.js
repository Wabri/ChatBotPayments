const messengerObj = messenger();
const btn = document.querySelector('button#talk');

// This is the interaction with button in index.html
btn.onclick = function() {
  messengerObj.you();
  recognition.start();
};

// SpeechRecognition is the controller interface of the web speech api for voice recognition
// SpeechRecognition (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Properties of recognition
recognition.lang = 'it-IT';
recognition.interimResults = false;

// When recognition produce a result we can catch this event with this
recognition.addEventListener('result', e => {
  var message = e.results[0][0].transcript;

  messengerObj.you(message);
  messengerObj.bot();

  // socket.emit register a new handler (text) for the given event ('chatMessage')
  socket.emit('chat message', message);
});

recognition.onsoundstart = toggleBtnAnimation;
recognition.onsoundend = toggleBtnAnimation;

function toggleBtnAnimation() {
  if (btn.classList.contains('animate')) {
    // remove class after animation is done
    var event = btn.addEventListener("animationiteration", ele => {
      console.log('ended');
      btn.classList.remove('animate');
      btn.removeEventListener('animationiteration', event);
    });
  } else {
    btn.classList.add('animate');
  }
}

// Now use Socket.io for bidirectional communication between web clients and servers
// Socket.io (https://socket.io/)
const socket = io();

// when bot reply event catch let's produce text audio reply
socket.on('bot response', botMessage => {
  synthVoice(botMessage);
  messengerObj.bot(botMessage);
});

// this function create a audio with the voice synth of the text
function synthVoice(text) {
  const synth = window.speechSynthesis;
  // The SpeechSynthesisUtterance interface of the Web Speech API represents a speech request.
  // It contains the content the speech service should read and information about how to read it.
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'it-IT';
  utterance.text = text;
  synth.speak(utterance);
}

// Handle updating of bot & you messages
function messenger() {
  // this is use to modify the field .output-you and .output-bot implemented in the index.html
  const you = document.querySelector('#you');
  const bot = document.querySelector('#bot');

  function updateMessage(msg) {
    console.log('this is ', this);
    msg = msg || this.getAttribute('default-message');
    this.innerHTML = '&nbsp;' + msg;
  }

  return {
    bot: updateMessage.bind(bot),
    you: updateMessage.bind(you)
  }
}
