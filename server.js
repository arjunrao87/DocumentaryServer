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
    search: (root, args) => {
      console.log( "search = " + JSON.stringify( args ) );
      return {"MovieConnection" : args }
    }
  },

  MovieConnection: {
    pageInfo(root, args ){
      console.log( "In movies connection pageinfo " + JSON.stringify(root))
      return {"root" : root, "hasNextPage" : "foo"}
    },
    edges(root, args){
      console.log( "In movies connection edges  " + JSON.stringify(root))
      return [{"root" : root}]
    }
  },

  MovieEdge : {
    node( root, args ){
      console.log( "In movies edge node " + JSON.stringify(root))
      return {"id" : "foo"}
    },
    cursor( root, args ){
      console.log( "In movies edge cursor" + JSON.stringify(root))
      return "bar"
    },
  },

  Movie:(obj, args, context, info) => {
    console.log( "In Movie mode" + JSON.stringify(obj))
  }
};

const typeDefs =
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
