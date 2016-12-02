var request = require('request');
var Config = require('../config');
const {Wit, log} = require('node-wit');
var sessions = {};

module.exports={
  getHook,
  postHook,
  sendToMessenger,
  findOrCreateSession,
  processWithWit
};

function getHook( req, res ){
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
  } else {
      res.send('Invalid verify token');
  }
}

function postHook( req, res ){
  var events = req.body.entry[0].messaging;
  console.log( "Events = " + JSON.stringify(events) );
  console.log( "# of Events = " + events.length );
  for (i = 0; i < events.length; i++) {
    var event = events[i];
    if (event.message && event.message.text) {
      const sender = event.sender.id;
      const sessionId = findOrCreateSession(sender);
      const {text, attachments} = event.message;
      console.log("Sender = " + sender + ", sessionId = " + sessionId + ", text = " + text );
      if (attachments) {
        sendToMessenger(sender, 'Sorry I can only process text messages for now.')
        .catch(console.error);
      } else if (text) {
        processWithWit(sender, text);
      } else {
        console.log('Received event', JSON.stringify(event));
      }
    }
    else if (event.postback) {
        console.log("Postback received: " + JSON.stringify(event.postback));
    }
  }
  res.sendStatus(200);
}

function findOrCreateSession(fbid) {
  let sessionId;
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      sessionId = k;
    }
  });
  if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
}

function processWithWit(sender, message) {
	if ( message.toUpperCase() === "HELLO" ) {
		message = 'Hello yourself! I am Docu. You can say "I want to watch a documentary"';
    sendToMessenger( sender, message);
	} else {
		var sessionId = findOrCreateSession(sender);
    console.log( "processWithWit :: Sender = " + sender + ", sessionId = " + sessionId + ", text = " + message + ", context = " + JSON.stringify(sessions[sessionId].context) );
		client.runActions(
			sessionId,
			message,
			sessions[sessionId].context)
    .then((context) => {
  				console.log('Waiting for further messages');
  			})
    .catch((err) => {
        console.error('Oops! Got an error from Wit: ', err.stack || err);
    })
  }
}

function sendToMessenger( id, text ) {
  const body = JSON.stringify({
    recipient: { id },
    message: { text },
  });
  const qs = 'access_token=' + encodeURIComponent(Config.FB_PAGE_ACCESS_TOKEN);
  return fetch('https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  })
  .then(rsp => rsp.json())
  .then(json => {
    if (json.error && json.error.message) {
      throw new Error(json.error.message);
    }
    return json;
  });
};


const actions = {

  send({sessionId}, {text}){
    return new Promise(function(resolve, reject) {
      console.log( "Sessionasd = " + JSON.stringify( FB.sessions ) );
      const recipientId = sessions[sessionId].fbid;
      sendToMessenger(recipientId, text)
      return resolve();
    });
  },

  merge({entities, context, message, sessionId,cb})  {
    return new Promise(function(resolve, reject) {
      return resolve(context);
    });
  },

  error(request) {
    console.log(JSON.stringify( request ))
  },

  getRecommendations({sessionId, context, text, entities}) {
        return Promise.resolve(context);
  }
}

var client = getWit();

function getWit() {
  return new Wit({
  accessToken: Config.WIT_TOKEN,
  actions:actions
  });
}
