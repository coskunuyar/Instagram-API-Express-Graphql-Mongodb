const RootQuery = require('./root-query');
const Mutation = require('./mutation');
const { GraphQLSchema  } = require('graphql');

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});