const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graph/index.js');
const cors = require('cors');
const { mongoURL } = require('./secret');


mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open' , () => console.log('Connected to database.'));

const app = express();
app.use(cors());
app.use('/v1',graphqlHTTP({ schema, graphiql: true }));
app.listen(4000, () => console.log(`Application is running on port 4000`));