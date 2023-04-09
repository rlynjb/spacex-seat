//require('dotenv').config();

import { createLocalServer } from './server.js';

const server = createLocalServer();

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `);
});