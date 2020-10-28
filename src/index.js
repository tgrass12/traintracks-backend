require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const resolvers = require('./resolvers');

const { PORT } = process.env;

const prisma = new PrismaClient();

const graphqlServer = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
    };
  },
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});

const cors = {
  credentials: true,
  origin: 'http://localhost:3000',
};

const graphqlOptions = { port: PORT, cors };
graphqlServer.express.use(cookieParser());
graphqlServer.start(graphqlOptions, () =>
  console.log(`GraphQL Server started at http://localhost:4000`),
);
