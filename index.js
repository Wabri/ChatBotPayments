(function () {
    'use strict';
    angular.module('revux').controller('ChatbotCtrl', ChatbotCtrl);

    function ChatbotCtrl($http, socket) {

        socket.on("userMessage", function (messageReceive) {
            console.log("*** Processing message: " + messageReceive + "****");
            /*
             * qui deve essere gestita la richiesta dell'utente
             * andando a chiamare il backend rasa che gestira'
             * la richiesta rispondendo con un json in cui
             * saranno definiti gli intenti e le entità della
             * richiesta
             */
            if (messageReceive == "conversation reset " + userID) {
                $http({
                    method: 'POST',
                    url: "http://192.168.170.120:5004/conversations/" + socket.id + "/continue",
                    data: $.param({
                        events: [{"event": "restart"}],
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function (data, status, headers, config) {
                    console.log("**** reset conversation ****");
                    socket.emit("botResponse", "La conversazione è stata cancellata");
                }).error(function (data, status, headers, config) {
                    console.log("**** C'è stato un errore durante la chiamata verso rasa ****");
                    console.log("errore: " + data);
                    socket.emit("botResponse", "In questo momento il servizio non è attivo, riprovare più tardi!");
                });
            } else {
                $http({
                    method: 'POST',
                    url: "http://192.168.170.120:5004/conversations/" + socket.id + "/parse",
                    data: $.param({
                        "query": "message"
                    }),
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data, status, headers, config) {
                    var arr = JSON.parse(data.text);
                    console.log("Sender: " + arr.tracker["sender_id"]);
                    console.log("next_action: " + arr.next_action);
                    if (arr.next_action != "action_listen") {
                        $http({
                            method: 'POST',
                            url: "http://192.168.170.120:5004/conversations/" + socket.id + "/respond",
                            data: $.param({
                                "query": "message"
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).success(function (data, status, headers, config) {
                            var arrt = JSON.parse(response.text);
                            console.log("botResponse: " + arrt[0].text);
                            socket.emit("botResponse", arrt[0].text);
                        }).error(function (data, status, headers, config) {
                            socket.emit("botResponse", "Puoi cercare di essere più chiaro?");
                        });
                    }
                }).error(function (data, status, headers, config) {
                    console.log("errore: " + err);
                    socket.emit("botResponse", "In questo momento il servizio non è attivo, riprovare più tardi!");
                });
            }
        });
    }

)();
