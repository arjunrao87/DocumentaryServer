var express = require('express');
var bodyParser = require('body-parser');
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
  botFunctions.getHook( req, res );
});


// handler receiving messages
app.post('/webhook', function (req, res) {
  botFunctions.postHook( req, res );
});

//------------------------ END OF MESSENGER BOT APIs -----------------------//
