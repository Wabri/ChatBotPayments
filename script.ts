var VoiceSpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
var voiceRecognition = new VoiceSpeechRecognition();
voiceRecognition.lang = "it-IT";
voiceRecognition.interimResults = false;

const socketIOClient = io();

class VoiceManager {
  static synthVoice(message: string) {
    const synth = speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "it-IT";
    utterance.text = message;
    synth.speak(utterance);
  }
}

class MessageSectionManager {
  static relativeMessageUpdate(message: string, whostalk: string) {
    let talkerElement = document.querySelector("span#" + whostalk);
    talkerElement.innerHTML = "&nbsp" + message;
  }
}

const buttonTalk = document.querySelector("button#talk");
buttonTalk.onclick = function() {
  MessageSectionManager.relativeMessageUpdate("Sto ascoltando...", "bot");
  voiceRecognition.start();
  $("input#inputMessage").val("");
};

const buttonWrite = document.querySelector("button#write");
buttonWrite.onclick = function() {
  $("form#messageForm").submit(() => {
    return false;
  });
  var inputMessageElementString: string = $("input#inputMessage").val();
  MessageSectionManager.relativeMessageUpdate(inputMessageElementString, "you");
  MessageSectionManager.relativeMessageUpdate("Sto pensando...", "bot");
  socketIOClient.emit("userMessage", inputMessageElementString);
  $("input#inputMessage").val("");
};

voiceRecognition.addEventListener("result", e => {
  var textVoiceMessage: string = e.results[0][0].transcript;
  MessageSectionManager.relativeMessageUpdate(textVoiceMessage, "you");
  MessageSectionManager.relativeMessageUpdate("Sto Pensando...", "bot");
  socketIOClient.emit("userMessage", textVoiceMessage);
});

socketIOClient.on("botResponse", (messageReceive: string) => {
  VoiceManager.synthVoice(messageReceive);
  MessageSectionManager.relativeMessageUpdate(messageReceive, "bot");
});
