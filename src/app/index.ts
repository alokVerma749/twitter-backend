import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

export async function initServer() {
  const app = express();

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        sayHello: String
      }
    `,
    resolvers: {
      Query: {
        sayHello: () => 'hii',
      },
    },
  });

  await gqlServer.start();

  app.use('/graphql', expressMiddleware(gqlServer));

  return app;
}
