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
	getWorkoutLog,
	addExerciseToLog
} = require('../handlers/workoutLog');

const { 
	preprocessFood,
	handleJournalEntryUpdate,
	validateDateString
} = require('../middleware/journal');

router.route('/range')
	.get(getJournalEntryRange);

router.all('/:date', validateDateString);

router.route('/:date')
	.get(getJournalEntry)
	.post(preprocessFood, handleJournalEntryUpdate)
	.delete(deleteJournalEntry);

router.route('/:date/workouts')
	.get(getWorkoutLog)
	.post(addExerciseToLog);

router.route('/:date/targets')
	.patch(setJournalEntryTargets);

router.route('/:date/water')
	.get(getWaterIntake)
	.post(setWaterIntake);

module.exports = router;