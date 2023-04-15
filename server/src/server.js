import { ApolloServer } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';

import { typeDefs } from './schema.js';
import { resolvers } from "./resolvers.js";
import { LaunchAPI } from "./datasources/launch.js";
//import { UserAPI } from "./datasources/user.js";
import { UserAPI } from "./datasources/user-mongodb.js";
//import { createStore } from "./utils/sqlite.js";
import { createStore } from "./utils/mongodb.js";
import isEmail from "isemail";

const store = createStore();

console.log('startup 5. server')

const config = {
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
  context: async ({ req }) => {
    console.log('5. context')

    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");

    if (!isEmail.validate(email)) return { user: null };

    // find a user by their email
    const users = await store.users.find({ email });
    if (!users) {
      users = await store.users.create({ email });
    }
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues } };
  },
  introspection: true,
  playground: true,
};


export const createLambdaServer = () => {
  return new ApolloServerLambda(config);
};


export const createLocalServer = () => {
  return new ApolloServer(config);
};