const mongoose = require('mongoose');

let loggedExerciseSchema = mongoose.Schema({
	'name': {
		type: String,
		required: true
	},
	'weight': {
		type: Number,
		required: true
	},
	'sets': {
		type: Number,
		required: true
	},
	'reps': {
		type: Number,
		required: true
	}
});

let LoggedExercise = mongoose.model('loggedexercise', loggedExerciseSchema);

module.exports = LoggedExercise;