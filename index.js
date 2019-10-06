require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT;

const User = require('./models/User');

const apiRoutes = require('./routes');
const {errorHandler} = require('./handlers/errorHandler');

//TODO: What if mongoose doesn't connect?
mongoose.connect(process.env.DB_HOST, 
	{ 
		useFindAndModify: false,
		useNewUrlParser: true,
		useCreateIndex: true
	}
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
	cookie: {
		httpOnly: false,
		maxAge: 1000 * 60 * 60 * 24 * 30 //Every 30 days
	},
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});

module.exports = app;