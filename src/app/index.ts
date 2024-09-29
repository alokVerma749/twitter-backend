import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { User } from './user';
import { queries } from './user/queries';

export async function initServer() {
  const app = express();

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
      ${User.types}
      type Query {
        ${User.queries}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
    },
  });

  await gqlServer.start();

  app.use('/graphql', expressMiddleware(gqlServer));

  return app;
}
