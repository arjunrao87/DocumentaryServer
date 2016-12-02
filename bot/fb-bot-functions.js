var request = require('request');
var Config = require('../config');
const {Wit, log} = require('node-wit');
var sessions = {};

module.exports={
  getHook,
  postHook
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
  for (i = 0; i < events.length; i++) {
    processEachEvent( events[i] );
  }
  res.sendStatus(200);
}

function processEachEvent(event){
  if (event.message && event.message.text) {
    const sender = event.sender.id;
    const sessionId = findOrCreateSession(sender);
    const {text, attachments} = event.message;
    if (text) {
      processMessages(sender, text);
    } else {
      console.log('Received event', JSON.stringify(event));
    }
  }
  else if (event.postback) {
      console.log("Postback received: " + JSON.stringify(event.postback));
  }
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

function processMessages(sender, message) {
	if ( isWelcomeGreeting(  message ) ) {
		processWelcomeGreeting( sender );
	} else {
    processOtherMessages( sender, message );
  }
}

function isWelcomeGreeting( message ){
  return message.toUpperCase() === "HELLO";
}

function processWelcomeGreeting( sender ){
  var message = 'Hello yourself! I am Docu. You can say "I want to watch a documentary"';
  sendToMessenger( sender, message);
}

function processOtherMessages( sender, message ){
  var sessionId = findOrCreateSession(sender);
  console.log( "processOtherMessages :: Sender = " + sender + ", sessionId = " + sessionId + ", text = " + message + ", context = " + JSON.stringify(sessions[sessionId].context) );
  client.runActions( sessionId, message, sessions[sessionId].context)
        .then((context) => {
          console.log('Waiting for further messages');
        })
        .catch((err) => {
          console.error('Oops! Got an error from Wit: ', err.stack || err);
        });
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

//---------------------------- WIT AI FUNCTIONALITY -------------------------//

const actions = {

  send({sessionId}, {text}){
    return new Promise(function(resolve, reject) {
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
