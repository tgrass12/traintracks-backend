const mongoose = require('mongoose');
const User = require('./User');
const Meal = require('./Meal');
const Nutrients = require('./Nutrients');
const WorkoutLog = require('./WorkoutLog');

const journalEntrySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	date: String,
	meals: [Meal.schema],
	water: {
		type: Number,
		default: 0
	},
	logged: Nutrients.schema,
	targets: Nutrients.schema,
	workouts: WorkoutLog.schema
});

const JournalEntry = mongoose.model('journalentry', journalEntrySchema);

module.exports = JournalEntry;