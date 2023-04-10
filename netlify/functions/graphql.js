import { createLambdaServer } from './bundle/server.js';

const server = createLambdaServer();

exports.handler = server.createHandler({
  cors: {
    origin: '*'
  }
});
