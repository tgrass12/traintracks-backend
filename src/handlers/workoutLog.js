const LoggedExercise = require('../models/LoggedExercise');
const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');

const createEntry = async function(user, date) {
	let entry = await JournalEntry.create({ 
		'user': user._id, 
		'date': date,
		'nutrition': {
			'targets': user.targets.diet,
			'meals': user.meals.map(m => { return { 'name': m } }),
			'logged': {
				'cals': 0,
				'macros': {
					'protein': 0,
					'carbs': {
						'total': 0
					},
					'fats': {
						'total': 0
					}
				}
			},
			'water': 0	
		}
	});
	await entry.save();
	return entry;
}

module.exports.getWorkoutLog = async function(req, res, next) {
	let { date } = req.params;
	let user = req.user;		
	try {
		let entry = await JournalEntry.findOne(
			{ 'user': user.id, 'date': date }
		).select('workouts').lean();

		if (!entry) {
			res.status(204);
		}

		res.json(entry);
			
	} catch(err) {
		next(err);
	}
}

module.exports.addExerciseToLog = async function(req, res, next) {
	let { date } = req.params;
	let user = req.user;

	try {
		let { exerciseName, weight, sets, reps } = req.body;

		let exercise = await LoggedExercise.create({
			name: exerciseName,
			weight: weight,
			sets: sets,
			reps: reps
		});

		let entry = await JournalEntry.findOne(
			{ 'user': user._id, 'date': date }
		);

		if (!entry) {
			entry = await createEntry(user, date);
		}
		
		entry = await JournalEntry.findOneAndUpdate(
			{ 'user': user._id, 'date': date },
			{			
				$push: { 'workouts': exercise }
			}
		);

		res.json(exercise);

	} catch(err) {
		next(err);
	}
}