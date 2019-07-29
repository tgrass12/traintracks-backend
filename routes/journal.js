const router = require('express').Router({ mergeParams: true });

const {
	getJournalEntry,
	getJournalEntryRange,
	deleteJournalEntry,
	setJournalEntryGoals
} = require('../handlers/journal');

const { 
	parseFood,
	handleJournalEntryUpdate
} = require('../middleware/journal');


router.route('/')
	.get(getJournalEntryRange);

router.route('/:date')
	.get(getJournalEntry)
	.post(parseFood, handleJournalEntryUpdate)
	.delete(deleteJournalEntry);

router.route('/:date/goals')
	.patch(setJournalEntryGoals);

module.exports = router;