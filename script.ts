#!
var VoiceSpeechRecognition =
  SpeechRecognition || window.webkitSpeechRecognition;
var voiceRecognition = new VoiceSpeechRecognition();

recognition.lang = "it-IT";
recognition.interimResults = false;

class VoiceManager {
  static synthVoice(message: string) {
    const synth = speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "it-IT";
    utterance.text = message;
    synth.speak(utterance);
  }
}

class DataSendSocketMessage {
  message: string;
  id: number;

  constructor(message: string, id: number) {
    this.message = message;
    this.id = id;
  }
}

class MessageSectionManager {
  static relativeMessageUpdate(message: string, whostalk: string) {
    let talkerElement = document.querySelector("span#" + whostalk);
    talkerElement.innerHTML = "&nbsp" + message;
  }
}

class ButtonReactor {
  buttonID: string;
  buttonElement: Element;

  constructor(buttonID: string) {
    this.buttonElement = document.querySelector(buttonID);
    this.buttonID = buttonID;
  }

  onClick() {}
}

class ButtonWrite extends ButtonReactor {
  constructor(buttonID: string) {
    super(buttonID);
  }

  onClick() {
    $("form#messageForm").submit(() => {
      return false;
    });
    const inputMessageElement = document.querySelector("input#inputMessage");
    var inputMessageElementString: string = inputMessageElement.innerHTML;
    MessageSectionManager.relativeMessageUpdate(
      inputMessageElementString,
      "you"
    );
    VoiceManager.synthVoice(inputMessageElementString);
    MessageSectionManager.relativeMessageUpdate("Sto pensando...", "bot");
    socket.emit(
      "userMessage",
      new DataSendSocketMessage(inputMessageElementString, 100)
    );
    inputMessageElement.innerHTML = "";
  }
}

class ButtonTalk extends ButtonReactor {
  constructor(buttonID: string) {
    super(buttonID);
  }

  onClick() {
    MessageSectionManager.relativeMessageUpdate("Sto ascoltando...", "bot");
    voiceRecognition.start();
  }
}

var buttonTalk = new ButtonTalk("button#talk");
var buttonWrite = new ButtonWrite("button#write");

recognition.addEventListener("result", e => {
  var textVoiceMessage: string = e.results[0][0].transcript;
  MessageSectionManager.relativeMessageUpdate(textVoiceMessage, "you");
  MessageSectionManager.relativeMessageUpdate("Sto Pensando...", "bot");
  socket.emit("userMessage", new DataSendSocketMessage(textVoiceMessage, 100));
});

socket.on("botResponse", (dataSocketMessage: DataSendSocketMessage) => {
  VoiceManager.synthVoice(dataSocketMessage.message);
  MessageSectionManager.relativeMessageUpdate(dataSocketMessage.message, "bot");
});
