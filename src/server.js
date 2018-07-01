require("babel-polyfill");

const express = require('express');
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors'
import typeDefs from "./typedefs"
import resolvers from "./resolvers"

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
