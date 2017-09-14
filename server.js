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
