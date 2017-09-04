require("babel-polyfill");
require("babel-core/register");

var rp = require('request-promise');

const BASE_URL = "https://api.themoviedb.org/3/"
const API_KEY = "3441b7624a92e83675247a43dad1ee91";
const SEARCH_URL = BASE_URL + "search/movie?api_key=" + API_KEY + "&query="

async function searchQuery( query ){
  const promise = searchForString( query );
  try{
    let results = await Promise.resolve( promise );
    return results;
  } catch ( error ){
    console.log( "Error = " + error )
  }
}

function searchForString( searchQuery ){
  const url = SEARCH_URL + searchQuery;
  var options = {
    method: 'GET',
    uri: url,
    json: true
  };
  return rp( options );
}

module.exports={
  searchForString,
  searchQuery
};

// Additional queries :
//https://developers.themoviedb.org/3/getting-started/search-and-query-for-details
