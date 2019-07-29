const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 4000;

const apiRoutes = require('./routes');
const {errorHandler} = require('./handlers/errorHandler');

//TODO: What if mongoose doesn't connect?
mongoose.connect('mongodb://localhost:27017/traintrax', 
	{ 
		useFindAndModify: false,
		useNewUrlParser: true,
		useCreateIndex: true
	}
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});

module.exports = app;