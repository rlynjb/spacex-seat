import { 
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  gql,
  useQuery
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { cache } from './cache';
import ReactDOM from 'react-dom/client';
import Pages from './pages';
import injectStyles from './styles';
import Login from './pages/login';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

/*
  we use the keyword extend to extend the Query schema type from our servers' schema
  by adding isLoggedIn and cartItems fields
*/
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    }
  }
});

// Initialize ApolloClient
const client = new ApolloClient({
  cache,
  typeDefs,
  link: authLink.concat(httpLink),
});

injectStyles();

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}


// Find our rootElement or throw and error if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

// Pass the ApolloClient instance to the ApolloProvider component;
root.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
);