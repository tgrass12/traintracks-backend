const router = require('express').Router({ mergeParams: true });

const {
	getJournalEntry,
	getJournalEntryRange,
	deleteJournalEntry,
	setJournalEntryTargets
} = require('../handlers/journal');

const { 
	parseFood,
	handleJournalEntryUpdate
} = require('../middleware/journal');

router.route('/')
	.get(getJournalEntry)
	.post(parseFood, handleJournalEntryUpdate)
	.delete(deleteJournalEntry);

router.route('/range')
	.get(getJournalEntryRange);


router.route('/:date/targets')
	.patch(setJournalEntryTargets);

module.exports = router;