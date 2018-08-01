#!/usr/bin/env node
"use strict";

var http = require("http");
var sa = require("superagent");

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

// ----- Gestione comunicazione con rasa core ---- //
class comunicationRasaManager {
  static questionAndAnswer(
    socket: any,
    message: string,
    rasaAddress: string,
    userID: string
  ) {
    try {
      sa.post(rasaAddress + "/conversations/" + userID + "/parse")
        .set("Content-Type", "application/json")
        .send({
          query: message
        })
        .end(function(err, res) {
          try {
            var arr = JSON.parse(res.text);
            console.log("Sender: " + arr.tracker["sender_id"]);
            console.log("next_action: " + arr.next_action);
            if (arr.next_action != "action_listen") {
              sa.post(rasaAddress + "/conversations/" + userID + "/respond")
                .set("Content-Type", "application/json")
                .send({
                  query: message
                })
                .end(function(err, res) {
                  var arrt = JSON.parse(res.text);
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
            socket.emit(
              "botResponse",
              "In questo momento il servizio non è attivo, riprovare più tardi!"
            );
            return;
          }
        });
    } catch (err) {
      console.log(
        "**** C'è stato un errore durante la chiamata verso rasa ****"
      );
      console.log("errore: " + err);
      socket.emit(
        "botResponse",
        "In questo momento il servizio non è attivo, riprovare più tardi!"
      );
      return;
    }
  }

  static conversationReset(socket: any, rasaAddress: string, userID: string) {
    try {
      sa.post(rasaAddress + "/conversations/" + userID + "/continue")
        .set("Content-Type", "application/json")
        .send({
          events: [{ event: "restart" }]
        })
        .end((err, res) => {
          console.log("**** reset conversation ****");
          socket.emit("botResponse", "La conversazione è stata cancellata");
        });
    } catch (err) {
      console.log(
        "**** C'è stato un errore durante la chiamata verso rasa ****"
      );
      console.log("errore: " + err);
      socket.emit(
        "botResponse",
        "In questo momento il servizio non è attivo, riprovare più tardi!"
      );
      return;
    }
  }
}

// ----- ----- //

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
    const rasaAddress =
      "http://" + settingsApp.rasaIP + ":" + settingsApp.rasaPort;
    const userID: string = socket.id;

    if (messageReceive != "conversation reset default") {
      /* esecuzione della post al server di rasa che eseguirà il parse del
     messaggio dell'utente*/
      comunicationRasaManager.questionAndAnswer(
        socket,
        messageReceive,
        rasaAddress,
        userID
      );
    } else {
      comunicationRasaManager.conversationReset(socket, rasaAddress, userID);
    }

    /*
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
*/
  });
});
// ----- fine gestione comunicazione tramite socket ----- //
