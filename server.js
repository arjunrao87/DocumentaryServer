var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var app = express();

var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var schema = buildSchema(
`
  type Query {
    hello: String
  }
`
);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', function (req, res) {
    res.send('Welcome to the homepage of the Movie Server');
});

app.listen(4000);

console.log('Running Movie Server at localhost:4000/graphql');
