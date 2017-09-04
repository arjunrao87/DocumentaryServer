var express = require('express');
var bodyParser = require('body-parser');
var FB = require('./bot/fb-bot-functions');
var newrelic = require( 'newrelic');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('Welcome to the homepage of the Documentary Server');
});

//------------------------ START OF MESSENGER BOT APIs -----------------------//

// Facebook Webhook
app.get('/webhook', function (req, res) {
  FB.getHook( req, res );
});


// handler receiving messages
app.post('/webhook', function (req, res) {
  FB.postHook( req, res );
});

//------------------------ END OF MESSENGER BOT APIs -----------------------//
