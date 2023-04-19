const { ApolloServer } = require('apollo-server-lambda');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');
const isEmail = require('isemail');

const { typeDefs } = require('./bundle/schema.js');
const { resolvers } = require('./bundle/resolvers.js');

const LaunchAPI = require('./bundle/datasources/launch.js');
const UserAPI = require('./bundle/datasources/user-mongodb.js');

const { createStore } = require('./bundle/utils/mongodb.js');
const store = createStore();


const dataSources = () => {
  return {
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }
};

const contextObj = async (req) => {  
  let auth = (req.headers && req.headers.authorization) || "";
  let email = Buffer.from(auth, "base64").toString("ascii");

  if (!isEmail.validate(email)) return { user: null };

  let users = await store.users.find({ email });
  if (!users) {
    users = await store.users.create({ email });
  }
  let user = (users && users[0]) || null;
  return { user: { user } };
};


const getHandler = (event, context) => {
  const server = new ApolloServer({
    csrfPrevention: true,
    introspection: true,
    playground: true,
    debug: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    origin: '*',
    credentials: true,
    typeDefs,
    resolvers,
    dataSources,
    context: contextObj,
  });

  const graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true
    }
  });
  if (!event.requestContext) {
      event.requestContext = context;
  }
  return graphqlHandler(event, context);
}

exports.handler = getHandler;