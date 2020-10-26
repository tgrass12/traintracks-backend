require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const session = require('express-session');
const pg = require('pg');
const PgSession = require('connect-pg-simple')(session);
const resolvers = require('./resolvers');

const {
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  APP_SECRET,
} = process.env;

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

const graphqlOptions = { port: PORT };
const dbConnection = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
};

graphqlServer.express.use(
  session({
    store: new PgSession({
      pool: new pg.Pool(dbConnection),
      tableName: 'user_session',
    }),
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 30, // Every 30 days
    },
    secret: APP_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
graphqlServer.start(graphqlOptions, () =>
  console.log(`GraphQL Server started at http://localhost:4000`),
);
