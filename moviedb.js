require("babel-polyfill");
require("babel-core/register");

var rp = require('request-promise');

const BASE_URL = "https://api.themoviedb.org/3/"
const API_KEY = "3441b7624a92e83675247a43dad1ee91";
const SEARCH_URL = BASE_URL + "search/movie?api_key=" + API_KEY + "&query="

function searchForString( searchQuery ){
  console.log( "Search query = " + searchQuery );
  const url = SEARCH_URL + searchQuery;
  var options = {
    method: 'GET',
    uri: url,
    json: true
  };
  return rp( options );
}

async function searchQuery( query ){
  console.log( "Search query - " + query )
  const promise = searchForString( query );
  try{
    let results = await Promise.resolve( promise );
    console.log( "JSON = " + JSON.stringify( results ));
  } catch ( error ){
    console.log( "Error = " + error )
  }
}

module.exports={
  searchForString,
  searchQuery
};

// Additional queries :
//https://developers.themoviedb.org/3/getting-started/search-and-query-for-details
