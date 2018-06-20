#!

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


class ButtonReactor {
  buttonID: string;
  buttonElement: Element;

  constructor(buttonID: string) {
    this.buttonElement = document.querySelector(buttonID);
    this.buttonID = buttonID;
  }

  relativeMessageUpdate(message: string, whostalk: string) {
    let element = document.querySelector("span#" + whostalk);
    element.innerHTML = "&nbsp" + message;
  }

  onClick() {
  }
}

class ButtonWrite extends ButtonReactor {
  constructor(buttonID: string) {
    super(buttonID);
  }

  onClick() {
    $("form#messageForm").submit(() => {
      return false;
    });
    const inputMessage = document.querySelector("input#inputMessage");
    var element = inputMessage.innerHTML;
    this.relativeMessageUpdate(element, "you");
    // repeat user message
    socket.emit("userMessage", element);
    inputMessage.innerHTML = "";
  }
}

class ButtonTalk extends ButtonReactor {
  constructor(buttonID: string) {
    super(buttonID);
  }

  onClick() {

  }
}
