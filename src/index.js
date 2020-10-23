require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);
const User = require('./models/User');
const apiRoutes = require('./routes');
const resolvers = require('./resolvers');
const { errorHandler } = require('./handlers/errorHandler');
const {
	PORT,
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME,
	APP_SECRET,
} = process.env;
const app = express();

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

// TODO: What if mongoose doesn't connect?
mongoose.connect(DB_HOST, {
	useFindAndModify: false,
	useNewUrlParser: true,
	useCreateIndex: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	session({
		cookie: {
			httpOnly: false,
			maxAge: 1000 * 60 * 60 * 24 * 30, // Every 30 days
		},
		secret: APP_SECRET,
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(3500, () => {
	console.log(`Now listening on port ${3500}`);
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
		store: new pgSession({
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

module.exports = app;
