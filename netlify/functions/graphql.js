const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

const { typeDefs } = require('./bundle/schema.js');
const { resolvers } = require('./bundle/resolvers.js');

const { LaunchAPI } = require('./bundle/datasources/launch.js');
const { UserAPI } = require('./bundle/datasources/user-mongodb.js');

const { createStore } = require('./bundle/utils/mongodb.js');
const isEmail = require('isemail');

const store = createStore();

// Construct a schema, using GraphQL schema language
/*
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
*/

const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store }),
});

const context1 = async ({ req }) => {
  console.log('5. context')
  
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || "";
  const email = Buffer.from(auth, "base64").toString("ascii");

  if (!isEmail.validate(email)) return { user: null };

  // find a user by their email
  let users = await store.users.find({ email });
  if (!users) {
    users = await store.users.create({ email });
  }
  const user = (users && users[0]) || null;
  return { user: { user } };
};

const getHandler = (event, context) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context: context1,
    csrfPrevention: true,
    introspection: true,
    playground: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  const graphqlHandler = server.createHandler();
  if (!event.requestContext) {
      event.requestContext = context;
  }
  return graphqlHandler(event, context);
}

exports.handler = getHandler;