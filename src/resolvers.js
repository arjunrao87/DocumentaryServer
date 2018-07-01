import rp from 'request-promise'
const BASE_URL = "https://api.themoviedb.org/3/"
const API_KEY = "3441b7624a92e83675247a43dad1ee91";
const SEARCH_URL = BASE_URL + "search/movie?api_key=" + API_KEY + "&query="
const DETAILS_URL = "?api_key="+ API_KEY + "&append_to_response=videos";

const resolvers = {
    Query : {
       searchByName : async (root, {name}) => {
        const {results} = await searchQuery( name );
        return results
      },
      searchByID : (root, {id}) => getMovieDetailsForId( id )
    },

    MovieDetail : {
      videos( root, args ){
        return root.videos.results
      }
    }
  };

const searchQuery = query => {
  const url = SEARCH_URL + query;
  var options = {
    method: 'GET',
    uri: url,
    json: true
  };
  return rp( options );
}

const getMovieDetailsForId = id =>{
  const url = BASE_URL + `movie/${id}` + DETAILS_URL;
  var options = {
    method: 'GET',
    uri: url,
    json: true
  };
  return rp( options );
}

export default resolvers;