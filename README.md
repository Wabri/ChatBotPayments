# BVChatBot
ChatBot prototype

## Try in a local server
You have to rename `.env.local` to `.env` then set up config inside of this file. You find 3 config:
1. `APIAI_TOKEN` this is the client access token give in dialogflow 
2. `APIAI_SESSION_ID` this is an arbitrary unique string
3. `PORT` is the port use by server

## How to use
```
$ cd BVChatBot
$ npm install
$ node index.js
```

## Try with Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://trainingchatbotbv.herokuapp.com/)
