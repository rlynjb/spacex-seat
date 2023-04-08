import { InMemoryCache, makeVar } from '@apollo/client';

// Initializes to true if localStorage includes a 'token' key,
// false otherwise
export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem('token'));
// JS version: export const isLoggedInVar = makeVar(!!localStorage.getItem('token'));

// Initializes to an empty array
export const cartItemsVar = makeVar<string[]>([]);
// JS version: export const cartItemsVar = makeVar([]);

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        }, // end - isLoggedIn

        cartItem: {
          read() {
            return cartItemsVar();
          },
        }, // end - cartItem

        launches: {
          keyArgs: false,
          merge(existing, incoming) {
            let launches:object[] = [];

            /* 
              if existing and incoming are the same,
              it cause duplicate key issue on launches page (home page)
              to fix, if both existing and incoming are the same, do not include existing
            */
            let existingString = (existing && existing.launches)
              ? JSON.stringify(existing.launches)
              : "";
            let incomingString = (incoming && incoming.launches)
              ? JSON.stringify(incoming.launches)
              : "";


            if (existingString === incomingString) {
              launches = launches.concat(incoming.launches);
            } else {

              if (existing && existing.launches) {
                launches = launches.concat(existing.launches);
              }
              if (incoming && incoming.launches) {
                launches = launches.concat(incoming.launches);
              }
            }

            return {
              ...incoming,
              launches,
            }
          },
        }, // end - launches
      },
    },
  },
});
