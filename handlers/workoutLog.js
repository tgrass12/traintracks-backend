const LoggedExercise = require('../models/LoggedExercise');
const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');

module.exports.getWorkoutLog = async function(req, res, next) {
	try {
		let { username, date } = req.params;
		
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOne(
			{ 'user': user.id, 'date': date }
		).select('workouts');

		if (!entry) {
			res.status(204);
		}

		res.json(entry);
			
	} catch(err) {
		next(err);
	}
}

module.exports.addExerciseToLog = async function(req, res, next) {
	try {
		let { username, date } = req.params;
		let user = await User.findByUsername(username);
		let { exerciseName, weight, sets, reps } = req.body;
		let exercise = await LoggedExercise.create({
			name: exerciseName,
			weight: weight,
			sets: sets,
			reps: reps
		});

		let entry = await JournalEntry.findOneAndUpdate(
			{ 'user': user.id, 'date': date },
			{
				$push: { 'workouts.exercise': exercise }
			},
			{ 'upsert': true, 'new': true }
		).select('workouts');

		res.json(entry);

	} catch(err) {
		next(err);
	}
}