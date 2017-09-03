
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var MOVIE_DB = require('./moviedb');
var app = express();

var root = {
  search: ({query}) => {
    return MOVIE_DB.searchQuery( query );
  },

  Movie:({query}) => {
    console.log( "query")
    return {
      "id" : "MockID"
    }
  }
};

var schema = buildSchema(
`
  type Movie{
    id : ID!
    voteCount : Int
    video : Boolean
    voteAverage : Float
    title : String
    popularity : Float
    posterPath : String
    originalLanguage : String
    originalTitle : String
    genreIds : [Int!]
    backdropPath : String
    adult : Boolean
    overview : String
    releaseDate : String
  }

  type Query{
    search(query:String!) : [Movie!]!
  }
`
);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', function (req, res) {
  console.log( "Hit the home page ");
  MOVIE_DB.searchForString( "Jack Reacher" );
});

app.listen(4000);

console.log('Running Movie Server at localhost:4000/graphql');
