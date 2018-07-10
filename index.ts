#!/usr/bin/env node
"use strict";

var http = require("http");
var request = require('request');

// ----- caricamento delle configurazioni definite nel file .env ----- //
const dotenv = require("dotenv");
dotenv.config();
// ----- fine caricamento delle configurazioni definite nel file .env ----- //

// ----- implementazione oggetto in cui si trovano informazioni App ----- //
class Settings {
  version: string;
  sessionID: string;
  expressPort: number;
  rasaIP: string;
  rasaPort: number;
  springIP: string;
  springPort: number;

  constructor(
    version: string,
    sessionID: string,
    expressPort: number,
    rasaIP: string,
    rasaPort: number,
    springIP: string,
    springPort: number
  ) {
    this.version = version;
    this.sessionID = sessionID;
    this.expressPort = expressPort;
    this.rasaIP = rasaIP;
    this.rasaPort = rasaPort;
    this.springIP = springIP;
    this.springPort = springPort;
  }
}

const settingsApp: Settings = new Settings(
  process.env.VERSION_APP,
  process.env.SESSION_ID,
  process.env.SERVER_PORT_EXPRESS,
  process.env.SERVER_IP_RASA,
  process.env.SERVER_PORT_RASA,
  process.env.SERVER_IP_SPRING,
  process.env.SERVER_PORT_SPRING
);
// ----- fine implementazione oggetto in cui si trovano informazioni App ----- //

// ----- creazione server ----- //
var express = require("express");
var app = express();

app.use(express.static(__dirname));
app.get("/", function(req, res) {
  console.log("**** new request ****");
  res.sendFile("index.html");
});

const server = app.listen(settingsApp.expressPort, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
  console.log(
    "Rasa backend on %s:%d",
    settingsApp.rasaIP,
    settingsApp.rasaPort
  );
  console.log(
    "Spring backend on %s:%d",
    settingsApp.springIP,
    settingsApp.springPort
  );
});
// ----- fine creazione server ----- //

// ----- gestione comunicazione tramite socket ----- //
const socketManager = require("socket.io");
var socketIOServer = new socketManager(server);

socketIOServer.on("connection", socket => {
  socket.on("userMessage", (messageReceive: string) => {
    console.log("*** Processing message: " + messageReceive + "****");
    /*
      qui deve essere gestita la richiesta dell'utente andando a
      chiamare il backend rasa che gestira la richiesta rispondendo
      con un json in cui saranno definiti gli intenti e le entità
      della richiesta
      */

    // esempio di richiesta al backend rasa_nlu
    var botResponse: string = "?????";
    let rasaRequest =
      "http://" + settingsApp.rasaIP + ":" + settingsApp.rasaPort + "/parse";
    rasaRequest += messageReceive;
    http.post(rasaRequest)
    http
      .get(rasaRequest, resp => {
        console.log("Rasa response");
        let data = "";

        resp.on("data", chunk => {
          data += chunk;
        });

        resp.on("end", () => {
          console.log(JSON.parse(data));
        });
      })
      .on("error", err => {
        console.log("Error: " + err.message);
      });
      var options = {
        hostname: settingsApp.rasaIP,
        port: settingsApp.rasaPort,
        path: '/conversations/default/parse',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      var req = http.request(options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(body) {
          console.log('Body: ' + body);
        });
      });
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      // write data to request body
      req.write('{"query":"Ciao"}');
      req.end();

      request.post(
        'http://' + settingsApp.rasaIP + ':' + settingsApp.rasaPort +
        '/conversations/default/parse', '{"query":"Ciao"}',
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body)
          }
        }
      );

    // esempio di richiesta al backend spring
    var requestToSpring: string =
      "http://" +
      settingsApp.springIP +
      ":" +
      settingsApp.springPort +
      "/v1/api/dataById?id=12";

    http
      .get(requestToSpring, resp => {
        console.log("Spring response");
        let data = "";

        resp.on("data", chunk => {
          data += chunk;
        });

        resp.on("end", () => {
          console.log(JSON.parse(data));
        });
      })
      .on("error", err => {
        console.log("Error: " + err.message);
      });

    // appena si ha il risultato della richeista dell'utente allora si manda la risposta all'utente
    console.log("**** Bot response: " + botResponse + " ****");
    socket.emit("botResponse", botResponse);
  });
});
// ----- fine gestione comunicazione tramite socket ----- //
