require("babel-polyfill");

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var MOVIE_DB = require('./moviedb');
var app = express();
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors'

const resolvers = {
  Query : {
    async search (root, {input}) {
      const results = await MOVIE_DB.searchQuery( input.query );
      return results.results; // This is an array of maps
    },
    async getMovieDetailsForId(root, {id}){
      const results = await MOVIE_DB.getMovieDetailsForId( id );
      return results; // This is a map
    }
  },

  MovieConnection: {
    pageInfo(root, args ){
      return {"query" : root}
    },
    edges(root, args){
      return root // This is an array of maps
    }
  },

  MovieEdge : {
    node( root, args ){
      return root // This is one of the elements of the above array because Graphql figures that out for you
    },
    cursor( root, args ){
      return "bar"
    },
  },

  MovieDetails : {
    videos( root, args ){
      return root.videos.results
    }
  }
};

const typeDefs =
`
  type MovieConnection{
    edges: [MovieEdge],
    pageInfo: PageInfo
  }

  type MovieEdge {
    node: Movie!,
    cursor: ID!
  }

  type Movie{
    id : ID!
    vote_count : Int
    video : Boolean
    vote_average : Float
    title : String
    popularity : Float
    poster_path : String
    original_language : String
    original_title : String
    genre_ids : [Int!]
    backdrop_path : String
    adult : Boolean
    overview : String
    release_date : String
  }

  type MovieDetails{
    id : ID!
    adult : Boolean
    backdrop_path : String
    belongs_to_collection : CollectionName
    budget : Float
    genres : [Genre]
    homepage : String
    imdb_id : String
    original_language : String
    original_title : String
    overview : String
    popularity : Float
    poster_path : String
    production_companies : [ProductionCompany]
    production_countries : [ProductionCountry]
    release_date : String
    revenue : Float
    runtime : Int
    spoken_languages : [SpokenLanguage]
    status : String
    tagline : String
    title : String
    vote_count : Int
    video : Boolean
    vote_average : Float
    videos : [VideoBlurb]
  }

  type VideoBlurb{
    id : String
    iso_639_1 : String
    iso_3166_1 : String
    key : String
    name : String
    site : String
    size : Int
    type : String
  }

  type SpokenLanguage{
    iso_639_1 : String
    name : String
  }

  type ProductionCompany{
    name : String
    id : Int
  }

  type ProductionCountry{
      iso_3166_1 : String
      name : String
  }

  type CollectionName{
    id : Int
    name : String
    poster_path : String
    backdrop_path : String
  }

  type Genre{
    id : Int
    name : String
  }

  type PageInfo {
    hasNextPage: Boolean
    hasPreviousPage: Boolean
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
    getMovieDetailsForId( id : String! ) : MovieDetails
  }
`
;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const GRAPHQL_PORT = 3000;

const graphQLServer = express().use('*',cors());

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema:schema, context:{} }));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
));
