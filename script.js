var VoiceSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var voiceRecognition = new VoiceSpeechRecognition();
voiceRecognition.lang = "it-IT";
voiceRecognition.interimResults = false;
var socketIOClient = io();
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
var MessageSectionManager = /** @class */ (function () {
    function MessageSectionManager() {
    }
    MessageSectionManager.relativeMessageUpdate = function (message, whostalk) {
        var talkerElement = document.querySelector("span#" + whostalk);
        talkerElement.innerHTML = "&nbsp" + message;
    };
    return MessageSectionManager;
}());
var buttonTalk = document.querySelector("button#talk");
buttonTalk.onclick = function () {
    MessageSectionManager.relativeMessageUpdate("Sto ascoltando...", "bot");
    voiceRecognition.start();
    $("input#inputMessage").val("");
};
var buttonWrite = document.querySelector("button#write");
buttonWrite.onclick = function () {
    $("form#messageForm").submit(function () {
        return false;
    });
    var inputMessageElementString = $("input#inputMessage").val();
    MessageSectionManager.relativeMessageUpdate(inputMessageElementString, "you");
    VoiceManager.synthVoice(inputMessageElementString);
    MessageSectionManager.relativeMessageUpdate("Sto pensando...", "bot");
    socketIOClient.emit("userMessage", inputMessageElementString);
    $("input#inputMessage").val("");
};
voiceRecognition.addEventListener("result", function (e) {
    var textVoiceMessage = e.results[0][0].transcript;
    MessageSectionManager.relativeMessageUpdate(textVoiceMessage, "you");
    MessageSectionManager.relativeMessageUpdate("Sto Pensando...", "bot");
    socketIOClient.emit("userMessage", textVoiceMessage);
});
socketIOClient.on("botResponse", function (messageReceive) {
    VoiceManager.synthVoice(messageReceive);
    MessageSectionManager.relativeMessageUpdate(messageReceive, "bot");
});
