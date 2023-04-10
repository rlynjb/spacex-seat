import { ApolloServer } from 'apollo-server';
import ApolloServerLambda from 'apollo-server-lambda';

import { gql } from 'apollo-server-lambda';
import { typeDefs } from './schema.js';
import { resolvers } from "./resolvers.js";
import { LaunchAPI } from "./datasources/launch.js";
import { UserAPI } from "./datasources/user.js";
import { createStore } from "./utils.js";
import isEmail from "isemail";

const store = createStore();


export const createLambdaServer = () => {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    dataSources: () => ({
      launchAPI: new LaunchAPI(),
      userAPI: new UserAPI({ store }),
    }),
    context: async ({ req }) => {
      // simple auth check on every request
      const auth = (req.headers && req.headers.authorization) || "";
      const email = Buffer.from(auth, "base64").toString("ascii");
  
      if (!isEmail.validate(email)) return { user: null };
  
      // find a user by their email
      const users = await store.users.findOrCreate({ where: { email } });
      const user = (users && users[0]) || null;
  
      return { user: { ...user.dataValues } };
    },
  });
};


export const createLocalServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      launchAPI: new LaunchAPI(),
      userAPI: new UserAPI({ store }),
    }),
    context: async ({ req }) => {
      // simple auth check on every request
      const auth = (req.headers && req.headers.authorization) || "";
      const email = Buffer.from(auth, "base64").toString("ascii");
  
      if (!isEmail.validate(email)) return { user: null };
  
      // find a user by their email
      const users = await store.users.findOrCreate({ where: { email } });
      const user = (users && users[0]) || null;
  
      return { user: { ...user.dataValues } };
    },
  });
};