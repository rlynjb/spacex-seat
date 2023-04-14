const { createLocalServer } = require('./server');

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test') {
  console.log('startup 1. - index');

  createLocalServer().listen().then(() => {
    console.log(`Server is running at http://localhost:4000`);
  });
}