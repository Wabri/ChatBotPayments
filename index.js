#!/usr/bin/env node
"use strict";
var http = require("http");
// ----- caricamento delle configurazioni definite nel file .env ----- //
var dotenv = require("dotenv");
dotenv.config();
// ----- fine caricamento delle configurazioni definite nel file .env ----- //
// ----- implementazione oggetto in cui si trovano informazioni App ----- //
var Settings = /** @class */ (function () {
    function Settings(version, sessionID, expressPort, rasaIP, rasaPort, springIP, springPort) {
        this.version = version;
        this.sessionID = sessionID;
        this.expressPort = expressPort;
        this.rasaIP = rasaIP;
        this.rasaPort = rasaPort;
        this.springIP = springIP;
        this.springPort = springPort;
    }
    return Settings;
}());
var settingsApp = new Settings(process.env.VERSION_APP, process.env.SESSION_ID, process.env.SERVER_PORT_EXPRESS, process.env.SERVER_IP_RASA, process.env.SERVER_PORT_RASA, process.env.SERVER_IP_SPRING, process.env.SERVER_PORT_SPRING);
// ----- fine implementazione oggetto in cui si trovano informazioni App ----- //
// ----- creazione server ----- //
var express = require("express");
var app = express();
app.use(express.static(__dirname));
app.get("/", function (req, res) {
    console.log("**** new request ****");
    res.sendFile("index.html");
});
var server = app.listen(settingsApp.expressPort, function () {
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
    console.log("Rasa backend on %s:%d", settingsApp.rasaIP, settingsApp.rasaPort);
    console.log("Spring backend on %s:%d", settingsApp.springIP, settingsApp.springPort);
});
// ----- fine creazione server ----- //
// ----- gestione comunicazione tramite socket ----- //
var socketManager = require("socket.io");
var socketIOServer = new socketManager(server);
socketIOServer.on("connection", function (socket) {
    socket.on("userMessage", function (messageReceive) {
        console.log("*** Processing message: " + messageReceive + "****");
        /*
          qui deve essere gestita la richiesta dell'utente andando a
          chiamare il backend rasa che gestira la richiesta rispondendo
          con un json in cui saranno definiti gli intenti e le entità
          della richiesta
          */
        // esempio di richiesta al backend rasa_nlu
        var botResponse = "?????";
        var rasaRequest = "http://" + settingsApp.rasaIP + ":" + settingsApp.rasaPort + "/parse?q=";
        rasaRequest += messageReceive;
        http
            .get(rasaRequest, function (resp) {
            console.log("Rasa response");
            var data = "";
            resp.on("data", function (chunk) {
                data += chunk;
            });
            resp.on("end", function () {
                console.log(JSON.parse(data));
            });
        })
            .on("error", function (err) {
            console.log("Error: " + err.message);
        });
        // esempio di richiesta al backend spring
        var requestToSpring = "http://" +
            settingsApp.springIP +
            ":" +
            settingsApp.springPort +
            "/v1/api/dataById?id=12";
        http
            .get(requestToSpring, function (resp) {
            console.log("Spring response");
            var data = "";
            resp.on("data", function (chunk) {
                data += chunk;
            });
            resp.on("end", function () {
                console.log(JSON.parse(data));
            });
        })
            .on("error", function (err) {
            console.log("Error: " + err.message);
        });
        // appena si ha il risultato della richeista dell'utente allora si manda la risposta all'utente
        console.log("**** Bot response: " + botResponse + " ****");
        socket.emit("botResponse", botResponse);
    });
});
