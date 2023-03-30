//require('dotenv').config();

import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema.js';
import { createStore } from "./utils.js";
import { LaunchAPI } from "./datasources/launch.js";
import { UserAPI } from "./datasources/user.js";
import { resolvers } from "./resolvers.js";

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  })
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `);
});