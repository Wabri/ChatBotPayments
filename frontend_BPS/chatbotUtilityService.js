(function() {
  'use strict';

  angular.module('revux').service("ChatbotService", ChatbotService);

  function ChatbotService($http) {

    var self = this;
    self.enstablishConnectionWithRasa = enstablishConnectionWithRasa;
    self.makeID = makeID;

    function enstablishConnectionWithRasa(xsrfToken, id) {
      $http.post("http://192.168.11.24:5005/conversations/" + id + "/tracker/events?token=wabridev",
        [{"event": "slot",
        "name": "xsrftoken",
        "value": xsrfToken }
      ],
      {
        'withCredentials': false
      }).then(function(response) {
        console.log("token salvato correttamente", response);
      }, function() {
        console.log("token impossibile da salvare");
      });
    }

    function makeID() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      for (var i = 0; i < 29; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    function sendMessageToRasa(id, vm) {
    	return $http.post("http://192.168.11.24:5005/conversations/" + id + "/parse?token=wabridev", {
            "query": vm.inputMessage
        }, {
          'withCredentials': false
        });
    }

  }
})();
