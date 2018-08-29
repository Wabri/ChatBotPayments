(function () {
    'use strict';
    angular.module('revux').controller('ChatbotCtrl', ChatbotCtrl);

    function ChatbotCtrl($http) {

        var socketManager = require("socket.io");
        var socketIOServer = new socketManager(server);
        socketIOServer.on("connection", function (socket) {
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
                    try {
                        // headers = "Content-Type", "application/json"
                        // payload = "events":[{"event":"restart"}]
                        var promise = $http.post("http://192.168.170.120:5004/conversations/" + socket.id + "/continue", payload)
                            .then(function successCallback(response) {
                                console.log("**** reset conversation ****");
                                socket.emit("botResponse", "La conversazione è stata cancellata");
                            });
                    } catch (err) {
                        console.log("**** C'è stato un errore durante la chiamata verso rasa ****");
                        console.log("errore: " + err);
                        socket.emit("botResponse", "In questo momento il servizio non è attivo, riprovare più tardi!");
                        return;
                    }
                } else {
                    // headers = "Content-Type", "application/json"
                    // body = {"query":"message"}
                    var promise = $http.post("http://192.168.170.120:5004/conversations/" + socket.id + "/parse", payload)
                        .then(function successCallback(response) {
                            try {
                                var arr = JSON.parse(res.text);
                                console.log("Sender: " + arr.tracker["sender_id"]);
                                console.log("next_action: " + arr.next_action);
                                if (arr.next_action != "action_listen") {
                                    // headers = "Content-Type", "application/json"
                                    // body = {"query":"message"}
                                    var promise = $http.post("http://192.168.170.120:5004/conversations/" + socket.id + "/respond", payload)
                                        .then(function successCallback(response) {
                                            var arrt = JSON.parse(response.text);
                                            console.log("botResponse: " + arrt[0].text);
                                            socket.emit("botResponse", arrt[0].text);
                                            return;
                                        });
                                } else {
                                    socket.emit("botResponse", "Puoi cercare di essere più chiaro?");
                                    return;
                                }
                            } catch (err) {
                                console.log("errore: " + err);
                                socket.emit("botResponse", "In questo momento il servizio non è attivo, riprovare più tardi!");
                                return;
                            }
                        });
                }
            });
        });
    }

)();