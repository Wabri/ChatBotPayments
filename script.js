#!
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var VoiceSpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
var voiceRecognition = new VoiceSpeechRecognition();
recognition.lang = "it-IT";
recognition.interimResults = false;
var VoiceManager = /** @class */ (function () {
    function VoiceManager() {
    }
    VoiceManager.synthVoice = function (message) {
        var synth = speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "it-IT";
        utterance.text = message;
        synth.speak(utterance);
    };
    return VoiceManager;
}());
var DataSendSocketMessage = /** @class */ (function () {
    function DataSendSocketMessage(message, id) {
        this.message = message;
        this.id = id;
    }
    return DataSendSocketMessage;
}());
var MessageSectionManager = /** @class */ (function () {
    function MessageSectionManager() {
    }
    MessageSectionManager.relativeMessageUpdate = function (message, whostalk) {
        var talkerElement = document.querySelector("span#" + whostalk);
        talkerElement.innerHTML = "&nbsp" + message;
    };
    return MessageSectionManager;
}());
var ButtonReactor = /** @class */ (function () {
    function ButtonReactor(buttonID) {
        this.buttonElement = document.querySelector(buttonID);
        this.buttonID = buttonID;
    }
    ButtonReactor.prototype.onClick = function () { };
    return ButtonReactor;
}());
var ButtonWrite = /** @class */ (function (_super) {
    __extends(ButtonWrite, _super);
    function ButtonWrite(buttonID) {
        return _super.call(this, buttonID) || this;
    }
    ButtonWrite.prototype.onClick = function () {
        $("form#messageForm").submit(function () {
            return false;
        });
        var inputMessageElement = document.querySelector("input#inputMessage");
        var inputMessageElementString = inputMessageElement.innerHTML;
        MessageSectionManager.relativeMessageUpdate(inputMessageElementString, "you");
        VoiceManager.synthVoice(inputMessageElementString);
        MessageSectionManager.relativeMessageUpdate("Sto pensando...", "bot");
        socket.emit("userMessage", new DataSendSocketMessage(inputMessageElementString, 100));
        inputMessageElement.innerHTML = "";
    };
    return ButtonWrite;
}(ButtonReactor));
var ButtonTalk = /** @class */ (function (_super) {
    __extends(ButtonTalk, _super);
    function ButtonTalk(buttonID) {
        return _super.call(this, buttonID) || this;
    }
    ButtonTalk.prototype.onClick = function () {
        MessageSectionManager.relativeMessageUpdate("Sto ascoltando...", "bot");
        voiceRecognition.start();
    };
    return ButtonTalk;
}(ButtonReactor));
var buttonTalk = new ButtonTalk("button#talk");
var buttonWrite = new ButtonWrite("button#write");
recognition.addEventListener("result", function (e) {
    var textVoiceMessage = e.results[0][0].transcript;
    MessageSectionManager.relativeMessageUpdate(textVoiceMessage, "you");
    MessageSectionManager.relativeMessageUpdate("Sto Pensando...", "bot");
    socket.emit("userMessage", new DataSendSocketMessage(textVoiceMessage, 100));
});
socket.on("botResponse", function (dataSocketMessage) {
    VoiceManager.synthVoice(dataSocketMessage.message);
    MessageSectionManager.relativeMessageUpdate(dataSocketMessage.message, "bot");
});
