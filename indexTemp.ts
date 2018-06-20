#!/usr/bin/env node

var http = require("http");

var express = require("express");
var app = express();

require("dotenv").config();

class Settings {
  version: string;
  sessionID: string;
  port: number;

  constructor(version: string, sessionID: string, port: number) {
    this.version = version;
    this.sessionID = sessionID;
    this.port = port;
  }
}

var settingsApp: Settings = new Settings(
  process.env.VERSION_APP,
  process.env.SESSION_ID,
  process.env.PORT_SERVER
);

app.use(express.static(__dirname));
app.get("/", function(res) {
  res.sendFile("index.html");
});

const server = app.listen(settingsApp.port, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});

const io = require("socket.io")(server);
