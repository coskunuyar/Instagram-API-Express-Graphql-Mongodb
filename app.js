const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
app.use('/v1',graphqlHTTP({ schema, graphiql: true }));
app.listen(4000, () => console.log(`Application is running on port 4000`));