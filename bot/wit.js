'use strict'

var Config = require('../config')
var FB = require('./fb-bot-functions')
var Wit = require('node-wit').Wit
var request = require('request')

module.exports = {
	getWit
}

// SETUP THE WIT.AI SERVICE
function getWit() {
	return new Wit({
  accessToken: Config.WIT_TOKEN,
  actions:actions
	});
}

var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}

const actions = {

	send (request,response) {
		// Our bot has something to say!
		// Let's retrieve the Facebook user whose session belongs to
		console.log( "RESPONSE TEXT object = " + JSON.stringify( response.text ) );
		const recipientId = request.context._fbid_;
		if (recipientId !== null) {
      return FB.sendToMessenger(recipientId, response.text)
      .then(() => null)
      .catch((err) => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    }
		else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      return Promise.resolve()
    }
	},

	merge({entities, context, message, sessionId,cb})  {
		// // Reset the recommendation story
		// delete context.getRecommendations;
		//
		// // Retrive the location entity and store it in the context field
		// var duration = firstEntityValue(entities, 'duration');
		// if (duration) {
		// 	context.duration = duration;
		// }
		//
		// // Retrieve the category
		// var searchQuery = firstEntityValue(entities, 'searchQuery')
		// if (searchQuery) {
		// 	context.searchQuery = searchQuery;
		// }
		//
		// // Retrieve the sentiment
		// var sentiment = firstEntityValue(entities, 'sentiment')
		// if (sentiment) {
		// 	context.ack = sentiment === 'positive' ? 'Glad your liked it!' : 'Aww, that sucks.'
		// } else {
		// 	delete context.ack
		// }
		// cb(context);
		return new Promise(function(resolve, reject) {
			return resolve(context);
		});
	},

	error(request) {
		console.log(JSON.stringify( request ))
	},

	['getRecommendations']( {entities, context} ){
		console.log( "Hitting getRecommendations");
		console.log( "Context = " + JSON.stringify( context ) );
		return new Promise(function(resolve, reject) {
			return resolve(context);
		});
	}
	// // list of functions Wit.ai can execute
	// ['fetch-weather'](sessionId, context, cb) {
	// 	// Here we can place an API call to a weather service
	// 	// if (context.loc) {
	// 	// 	getWeather(context.loc)
	// 	// 		.then(function (forecast) {
	// 	// 			context.forecast = forecast || 'sunny'
	// 	// 		})
	// 	// 		.catch(function (err) {
	// 	// 			console.log(err)
	// 	// 		})
	// 	// }
	//
	// 	context.forecast = 'Sunny'
	//
	// 	cb(context)
	// },
}

// BOT TESTING MODE
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit();
	client.interactive();
}

// GET WEATHER FROM API
// var getWeather = function (location) {
// 	return new Promise(function (resolve, reject) {
// 		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
// 		request(url, function (error, response, body) {
// 		    if (!error && response.statusCode == 200) {
// 		    	var jsonData = JSON.parse(body)
// 		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
// 		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
// 		      return forecast
// 		    }
// 			})
// 	})
// }

// CHECK IF URL IS AN IMAGE FILE
var checkURLIsImage = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
