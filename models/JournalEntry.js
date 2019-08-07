const mongoose = require('mongoose');
const User = require('./User');
const Meal = require('./Meal');
const Nutrients = require('./Nutrients');

const journalEntrySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	date: String,
	meals: [Meal.schema],
	water: {
		type: Number,
		default: 0
	},
	total: Nutrients.schema,
	targets: Nutrients.schema
});

journalEntrySchema.static('createJournalFrame', function(mealNames, targets) {
	try {
		let emptyJournal = {
			total: new Nutrients(),
			targets: targets,
			meals: []
		};
		for (let meal of mealNames) {
			emptyJournal.meals.push(new Meal({name: meal}));
		}
		return emptyJournal;
	} catch(err) {
		return {'err': err};
	}	
});

const JournalEntry = mongoose.model('journalentry', journalEntrySchema);

module.exports = JournalEntry;