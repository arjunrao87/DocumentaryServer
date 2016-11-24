var request = require('request');

module.exports={
  getHook,
  postHook,
  sendToMessenger
};

// FB Webhook event handler
function getHook( req, res ){
  if (req.query['hub.verify_token'] === 'documentary_server_101_verify_token') {
      res.send(req.query['hub.challenge']);
  } else {
      res.send('Invalid verify token');
  }
}

// Responding to user-sent messages
function postHook( req,res ){
  var events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
      var event = events[i];
      if (event.message && event.message.text) {
          sendToMessenger(event.sender.id, {text:event.message.text});
      }
  }
  res.sendStatus(200);
}

// generic function sending messages
function sendToMessenger( recipientId, message ) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
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
