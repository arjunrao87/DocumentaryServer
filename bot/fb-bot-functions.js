var request = require('request');
var Config = require('../config');
var wit = require('./wit').getWit();
var sessions = {};

module.exports={
  getHook,
  postHook,
  sendToMessenger,
  findOrCreateSession,
  processWithWit
};

// FB Webhook event handler
function getHook( req, res ){
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
  } else {
      res.send('Invalid verify token');
  }
}

function postHook( req, res ){
  const data = req.body;
  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && !event.message.is_echo) {
          const sender = event.sender.id;
          const sessionId = findOrCreateSession(sender);
          const {text, attachments} = event.message;
          console.log("Sender = " + sender + ", sessionId = " + sessionId + ", text = " + text );
          if (attachments) {
            sendToMessenger(sender, 'Sorry I can only process text messages for now.')
            .catch(console.error);
          } else if (text) {
            processWithWit(sender, text, function (sender, reply) {
            sendToMessenger(sender, reply) });
          } else {
            console.log('Received event', JSON.stringify(event));
          }
        }
      });
    });
  }
}

function findOrCreateSession(fbid) {
  var sessionId;

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k;
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }
  return sessionId;
}

function processWithWit(sender, message, reply) {
	if (message.toUpperCase() === 'HELLO') {
		message = 'Hello yourself! I am Docu. You can say "I want to watch a documentary"'
		reply(sender, message)
	} else {
		var sessionId = findOrCreateSession(sender)
		wit.runActions(
			sessionId, // the user's current session by id
			message,  // the user's message
			sessions[sessionId].context)
    .then((context) => {
  				console.log('Waiting for further messages')
  				// Based on the session state, you might want to reset the session
  				// Example:
  				// if (context['done']) {
  				// 	delete sessions[sessionId]
  				// }
  				// Updating the user's current session state
  				sessions[sessionId].context = context
  			})
    .catch((err) => {
        console.error('Oops! Got an error from Wit: ', err.stack || err);
    })
  }
}

// generic function sending messages
function sendToMessenger( recipientId, message ) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: Config.FB_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};
