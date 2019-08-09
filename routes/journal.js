const router = require('express').Router({ mergeParams: true });

const {
	getJournalEntry,
	getJournalEntryRange,
	deleteJournalEntry,
	setJournalEntryTargets,
	getWaterIntake,
	setWaterIntake
} = require('../handlers/journal');

const { 
	preprocessFood,
	handleJournalEntryUpdate
} = require('../middleware/journal');

router.route('/range')
	.get(getJournalEntryRange);

router.route('/:date')
	.get(getJournalEntry)
	.post(preprocessFood, handleJournalEntryUpdate)
	.delete(deleteJournalEntry);

router.route('/:date/targets')
	.patch(setJournalEntryTargets);

router.route('/:date/water')
	.get(getWaterIntake)
	.patch(setWaterIntake);

module.exports = router;