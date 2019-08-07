const router = require('express').Router({ mergeParams: true });

const {
	getJournalEntry,
	getJournalEntryRange,
	deleteJournalEntry,
	setJournalEntryTargets,
	setWaterIntake
} = require('../handlers/journal');

const { 
	preprocessFood,
	handleJournalEntryUpdate
} = require('../middleware/journal');

router.route('/:date')
	.get(getJournalEntry)
	.post(preprocessFood, handleJournalEntryUpdate)
	.delete(deleteJournalEntry);

router.route('/range')
	.get(getJournalEntryRange);

router.route('/:date/targets')
	.patch(setJournalEntryTargets);

router.route('/:date/water')
	.patch(setWaterIntake);

module.exports = router;