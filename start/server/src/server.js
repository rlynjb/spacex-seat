import { ApolloServer } from 'apollo-server';
import ApolloServerLambda from 'apollo-server-lambda';
import { gql } from 'apollo-server-lambda';

export const createLambdaServer = () => {
  return new ApolloServerLambda({
    //
  });
};

export const createLocalServer = () => {
  return new ApolloServer({
    //
  });
};