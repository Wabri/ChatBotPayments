// Express is require to run chat in a local server
// Express (https://expressjs.com/)

// Creation of server
const express = require('express');
const app = express();

// Set workdirectory of app
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname));

// Open port 5000
const server = app.listen(5000);

// When someone send a request to app then send index.html
app.get('/', (req, res) => {
    res.sendFile('index.html');
});