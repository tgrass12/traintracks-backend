const mongoose = require('mongoose');
const User = require('./User');
const Diet = require('./Diet');

const journalEntrySchema = new mongoose.Schema({
	//Date will be JSON-format String
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	date: String,
	diet: Diet.schema
});

const JournalEntry = mongoose.model('journalentry', journalEntrySchema);

module.exports = JournalEntry;