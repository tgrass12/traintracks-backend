const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const Food = require('../models/Food');
const LoggedFood = require('../models/LoggedFood');
const Meal = require('../models/Meal');
const ObjectId = require('mongoose').Types.ObjectId;
const util = require('../shared/util');

module.exports.getJournalEntry = async function(req, res, next) {
	let {username, date} = req.params;
	try {
		let user = await User.findByUsername(username);

		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}

		let entry = await JournalEntry.findOne({
			'user': user.id, 'date': date
		}).populate('meals.foods').lean();

		if (!entry) {
			let meals = user.meals.map(m => {
				return {"name": m}
			});
			return res.json({
				"meals": meals,
				"targets": user.targets.diet,
				"water": 0
			});
		}

		res.json(entry);

	} catch(err) {
		next(err);
	}
}

module.exports.getJournalEntryRange = async function(req, res, next) {
	let {username} = req.params;
	let {range, scope} = req.query;

	try {
		let user = await User.findByUsername(username);
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}
		let range = util.getDateRange(scope);
		let entries = await JournalEntry.find({
			'user': user.id,
			'date': { $gte: range.start, $lte: range.end }
		}).select('date logged').lean();

		res.json(entries);
	} catch(err) {
		next(err);
	}
}

module.exports.deleteJournalEntry = async function(req, res, next) {
	let {username, date} = req.params;

	try {
		let user = await User.findByUsername(username);
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}
		let entry = await JournalEntry.findOneAndDelete(
			{'user': user.id, 'date': date}
		);

		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${username} on ${date}.`);
		}

		res.status(204).send();
	} catch(err) {
		next(err);
	}
}

module.exports.addFoodToJournal = async function(req, res, next) {
	let {username, date} = req.params;
	let {meal} = req.query;
	let {cals, macros, loggedFoodId} = req.body;
	try {
		let user = await User.findByUsername(username);
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);			
		}

		userMeals = user.meals.map(m => {
			return {'name': m}
		});
		
		await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$setOnInsert: 
				{ 
					'targets': user.targets.diet,
					'meals': userMeals
				}
			},
			{ 'upsert': true, 'setDefaultsOnInsert': true }
		);
		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date, 'meals.name': meal},
			{
				$inc: {
					'logged.cals': cals,
					'logged.macros.carbs.total': macros.carbs.total,
					'logged.macros.carbs.sugars': macros.carbs.sugars,
					'logged.macros.carbs.fiber': macros.carbs.fiber,
					'logged.macros.protein': macros.protein,
					'logged.macros.fats.total': macros.fats.total,
					'logged.macros.fats.sat': macros.fats.sat,
					'logged.macros.fats.poly': macros.fats.poly,
					'logged.macros.fats.mono': macros.fats.mono,
					'logged.macros.fats.trans': macros.fats.trans,
					'meals.$.total.cals': cals,
					'meals.$.total.macros.carbs.total': macros.carbs.total,
					'meals.$.total.macros.carbs.sugars': macros.carbs.sugars,
					'meals.$.total.macros.carbs.fiber': macros.carbs.fiber,
					'meals.$.total.macros.protein': macros.protein,
					'meals.$.total.macros.fats.total': macros.fats.total,
					'meals.$.total.macros.fats.sat': macros.fats.sat,
					'meals.$.total.macros.fats.poly': macros.fats.poly,
					'meals.$.total.macros.fats.mono': macros.fats.mono,
					'meals.$.total.macros.fats.trans': macros.fats.trans,
				},
				$push: { 'meals.$.foods': loggedFoodId }
			},
			{new: true, lean: true}
		).select('meals');
		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${username} on ${date}.`);
		}

		res.json(entry);
	} catch(err) {
		next(err);
	}
}

module.exports.removeFoodFromJournal = async function(req, res, next) {
	let {username, date} = req.params;
	let {meal} = req.query;
	let {loggedFoodId} = req.body;
	try {
		let user = await User.findByUsername(username);
		let loggedFood = await LoggedFood.findById(loggedFoodId);
		if (!loggedFood) {
			res.status(404);
			return next(`No logged food found with id ${loggedFoodId}`)
		}
		let {cals, macros} = loggedFood.food;
		let entry = await JournalEntry.findOneAndUpdate(
			{ 
				'user': user.id, 
				'date': date,
				'meals.name': meal,
				'meals.foods': loggedFoodId 
			},
			{
				$inc: {
					'logged.cals': -cals,
					'logged.macros.carbs.total': -macros.carbs.total,
					'logged.macros.carbs.sugars': -macros.carbs.sugars,
					'logged.macros.carbs.fiber': -macros.carbs.fiber,
					'logged.macros.protein': -macros.protein,
					'logged.macros.fats.total': -macros.fats.total,
					'logged.macros.fats.sat': -macros.fats.sat,
					'logged.macros.fats.poly': -macros.fats.poly,
					'logged.macros.fats.mono': -macros.fats.mono,
					'logged.macros.fats.trans': -macros.fats.trans,				
					'meals.$.total.cals': -cals,
					'meals.$.total.macros.carbs.total': -macros.carbs.total,
					'meals.$.total.macros.carbs.sugars': -macros.carbs.sugars,
					'meals.$.total.macros.carbs.fiber': -macros.carbs.fiber,
					'meals.$.total.macros.protein': -macros.protein,
					'meals.$.total.macros.fats.total': -macros.fats.total,
					'meals.$.total.macros.fats.sat': -macros.fats.sat,
					'meals.$.total.macros.fats.poly': -macros.fats.poly,
					'meals.$.total.macros.fats.mono': -macros.fats.mono,
					'meals.$.total.macros.fats.trans': -macros.fats.trans
				},
				$pull: { 'meals.$.foods': loggedFoodId }
			},
			{new: true}
		);

		await LoggedFood.findByIdAndDelete(loggedFoodId);
		if (!entry) {
			return next({
				err: 'Journal entry not found with given parameters.',
				params: {
					date: date,
					meal: meal,
					loggedFoodId: loggedFoodId
				}
			});
		}
		res.status(200).json(entry);
	}

	catch(err) {
		next(err);
	}
}

module.exports.setJournalEntryTargets = async function(req, res, next) {
	let {username, date} = req.params;
	let targets = req.body;
	try {
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$set: {
					'targets': targets
				}
			},
			{new: true}
		)
		res.json(entry.targets);
	} catch(err) {
		next(err);
	}
}

module.exports.setWaterIntake = async function(req, res, next) {
	let {username, date} = req.params;
	let {waterAmount} = req.body;

	try {
		let user = await User.findByUsername(username);

		userMeals = user.meals.map(m => {
			return {'name': m}
		});
		
		//TODO: Handle default empty values better
		await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$setOnInsert: 
				{ 
					'targets': user.targets.diet,
					'meals': userMeals,
					"logged": {
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
				}
			},
			{ 'upsert': true, 'setDefaultsOnInsert': true }
		);

		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$inc: {
					water: waterAmount
				}
			},
			{new: true}
		).select('water');

		if (!entry) {
			res.status(404);
			return next(`No journal found for ${username} on '${date}'`);
		}
		res.json(entry);
	} catch(err) {
		next(err);
	}
}

module.exports.getWaterIntake = async function(req, res, next) {
	let {username, date} = req.params;

	try {
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOne({
			'user': user.id, 'date': date
		}).select('water -_id').lean();

		if (!entry) {
			res.status(404);
			return next(`No journal found for ${username} on '${date}'`);
		}

		res.json(entry);
	} catch(err) {
		next(err);
	}
}