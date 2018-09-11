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

    function sendUserMessage() {

      $http.post("http://192.168.170.120:5004/conversations/" + id + "/parse?token=wabridev", {
        "query": $scope.inputMessage
      }, {
        'withCredentials': false
      }).then(function(response) {
        $scope.userMessage = $scope.inputMessage;
				$scope.inputMessage = "";
				$http.post("http://192.168.170.120:5004/conversations/" + id + "/respond?token=wabridev", {
	        "query": $scope.userMessage
	      }, {
	        'withCredentials': false
	      }).then(function(response) {
					try {
          $scope.botMessage = response.data[0].text;
        } catch (e) {
          console.log("Testo non compreso")
        }
	      }, function() {});
      }, function() {});
    }
  }

})();
