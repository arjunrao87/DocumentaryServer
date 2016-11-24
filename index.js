var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var botFunctions = require('./bot/bot-functions');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('Welcome to the homepage of the Documentary Server');
    console.log( "You have hit the home page" );
});


//------------------------ START OF MESSENGER BOT APIs -----------------------//

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'documentary_server_101_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            botFunctions.sendToMessenger(event.sender.id, {text:event.message.text});
        }
    }
    res.sendStatus(200);
});

//------------------------ END OF MESSENGER BOT APIs -----------------------//
