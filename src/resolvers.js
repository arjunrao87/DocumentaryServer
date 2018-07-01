const MOVIE_DB = require('./moviedb');

const resolvers = {
    Query : {
      async searchByName (root, {name}) {
        const results = await MOVIE_DB.searchQuery( name );
        return results.results; // This is an array of maps
      },
      async searchByID(root, {id}){
        const results = await MOVIE_DB.getMovieDetailsForId( id );
        return results; // This is a map
      }
    },

    MovieDetail : {
      videos( root, args ){
        return root.videos.results
      }
    }
  };

  export default resolvers;