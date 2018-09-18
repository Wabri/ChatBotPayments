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
    	annyang.addCommands(commands);
    	annyang.debug();
    	annyang.start();
    }
    
    var commands = {
    		'*message' : function(message) {
    			console.log(message);
    			$scope.userMessage = message;
    			ChatbotService.sendMessageToRasa(id, $scope.userMessage).then(function(response) {
    		        ChatbotService.reciveMessageFromRasa(id, $scope.userMessage).then(function(response) {
    		            if (response.data[0].text != null) {
    		            	$scope.botMessage = response.data[0].text;
    		            	voiceSynth($scope.botMessage);
    		            } else {
    		            	$scope.botMessage = "Errore";
    		            }
    		        }, function() {});
    		      }, function() {});
    		}
    }

  }

})();
