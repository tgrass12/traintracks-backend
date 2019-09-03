const mongoose = require('mongoose');
const User = require('./User');
const NutritionJournal = require('./NutritionJournal');
const LoggedExercise = require('./LoggedExercise');

const journalEntrySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	date: String,
	nutrition: NutritionJournal.schema,
	workouts: [LoggedExercise.schema]
});

const JournalEntry = mongoose.model('journalentry', journalEntrySchema);

module.exports = JournalEntry;