(function() {
  'use strict';

  angular.module('revux').controller('ChatbotCtrl', ChatbotCtrl);

  function ChatbotCtrl($http, $scope, $cookies, ChatbotService) {

    $scope.userMessage = "Il tuo messaggio";
    $scope.botMessage = "Il messaggio del bot";

    var xsrfToken = $cookies.get($http.defaults.xsrfCookieName);

    var id = ChatbotService.makeID();

    ChatbotService.enstablishConnectionWithRasa(xsrfToken, id);

    $scope.inputMessage = "Manda un messaggio al bot!";

    $scope.sendUserMessage = sendUserMessage;

    function voiceSynth (text) {
    	var utterance = new SpeechSynthesisUtterance();
    	utterance.lang = "it-IT";
    	utterance.text = text;
    	speechSynthesis.speak(utterance);
    }
    
    function voiceRecognition() {
    	var recognizer = new speechRecognition();
    	recognizer.continous = false; // questo serve per stoppare il riconoscimento quando l'utente smette di parlare
    	recognizer.lang = "it-IT";
    	
    	recognizer.onresult = function(event) {
    		return event.results[0][0].transcript;
    	}
    }
    
    function sendUserMessage() {

      ChatbotService.sendMessageToRasa(id, $scope.inputMessage).then(function(response) {
        $scope.userMessage = $scope.inputMessage;
        $scope.inputMessage = "";
        ChatbotService.reciveMessageFromRasa(id,$scope.inputMessage).then(function(response) {
            if (response.data[0].text != null) {
            	$scope.botMessage = response.data[0].text;
            	voiceSynth($scope.botMessage);
            } else {
            	$scope.botMessage = "Errore";
            }
        }, function() {});
      }, function() {});
      
    }
    
    function listenUserMessage() {
//    	annyang.addCommands(commands);
//    	annyang.debug();
//    	annyang.start();
    	
    	$scope.botMessage = voiceRecognition();
    	
    	ChatbotService.sendMessageToRasa(id, $scope.inputMessage).then(function(response) {
            $scope.userMessage = $scope.inputMessage;
            $scope.inputMessage = "";
            ChatbotService.reciveMessageFromRasa(id,$scope.inputMessage).then(function(response) {
                if (response.data[0].text != null) {
                	$scope.botMessage = response.data[0].text;
                	voiceSynth($scope.botMessage);
                } else {
                	$scope.botMessage = "Errore";
                }
            }, function() {});
          }, function() {});
    	
    }
    
//    usato da annyang prima di scoprire che c'era il riconoscimento vocale integrato 
//    var commands = {
//    		'*message' : function(message) {
//    			console.log(message);
//    			$scope.userMessage = message;
//    			ChatbotService.sendMessageToRasa(id, $scope.userMessage).then(function(response) {
//    		        ChatbotService.reciveMessageFromRasa(id, $scope.userMessage).then(function(response) {
//    		            if (response.data[0].text != null) {
//    		            	$scope.botMessage = response.data[0].text;
//    		            	voiceSynth($scope.botMessage);
//    		            } else {
//    		            	$scope.botMessage = "Errore";
//    		            }
//    		        }, function() {});
//    		      }, function() {});
//    		}
//    }

  }

})();
