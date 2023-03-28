//require('dotenv').config();

//const { ApolloServer } = reqiure("apollo-server");
import { ApolloServer } from 'apollo-server';
//const typeDefs = require("./schema");
import { typeDefs } from './schema.js';

const server = new ApolloServer({ typeDefs });

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `);
});