import { ApolloServer } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';

import { gql } from 'apollo-server-lambda';
import { typeDefs } from './schema.js';
import { resolvers } from "./resolvers.js";
import { LaunchAPI } from "./datasources/launch.js";
import { UserAPI } from "./datasources/user.js";
//import { createStore } from "./utils/sqlite.js";
import { createMongoDBStore } from "./utils/mongodb.js";
import isEmail from "isemail";

//const sqlitedb = createStore();
const mongodb = createMongoDBStore();

const config = {
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ mongodb }),
  }),
  context: async ({ req }) => {
    mongodb();
    console.log('mongodb>> ', mongodb)
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");

    if (!isEmail.validate(email)) return { user: null };

    // find a user by their email
    const users = await mongodb.users.find({ where: { email } });
    if (!users) {
      users = await mongodb.users.create({ email });
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