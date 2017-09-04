
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var MOVIE_DB = require('./moviedb');
var app = express();

var root = {
  search: (obj, args, context, info) => {
    console.log( "In Search mode " + JSON.stringify(obj));
    //return MOVIE_DB.searchQuery( query );
  },

  MovieConnection:(obj, args, context, info) => {
    console.log( "In movies mode" + JSON.stringify(obj))
  },

  Movie:(obj, args, context, info) => {
    console.log( "In Movie mode" + JSON.stringify(obj))
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

  type MovieConnection{
    edges: [MovieEdge],
    pageInfo: PageInfo
  }

  type MovieEdge {
    node: Movie!,
    cursor: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  input SearchQuery{
    query:String!,
    first: Int,
    last: Int,
    after: ID,
    before: ID
  }

  type Query{
    search( input:SearchQuery! ) : MovieConnection
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
