import { InMemoryCache, Reference } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        launches: {
          keyArgs: false,
          merge(existing, incoming) {
            let launches:object[] = [];

            // if existing and incoming are the same, it cause duplicate key issue on launches page (home page)
            // to fix, if both existing and incoming are the same, do not include existing
            let existingString = (existing && existing.launches) ? JSON.stringify(existing.launches) : "";
            let incomingString = (incoming && incoming.launches) ? JSON.stringify(incoming.launches) : "";
            let isSame = (existingString === incomingString) ? true : false;

            if (isSame) {
              if (incoming && incoming.launches) {
                launches = launches.concat(incoming.launches);
              }
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
        },
      },
    },
  },
});
