const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const Food = require('../models/Food');
const LoggedFood = require('../models/LoggedFood');
const Meal = require('../models/Meal');
const ObjectId = require('mongoose').Types.ObjectId;
const util = require('../shared/util');

module.exports.getJournalEntry = async function(req, res, next) {
	let { date } = req.params;
	let user = req.user;
	try {

		let entry = await JournalEntry.findOne({
			'user': user.id, 'date': date
		}).populate('nutrition.meals.foods').lean();

		if (!entry) {
			res.sendStatus(204);
		}
		else {
			res.json(entry);
		}

	} catch(err) {
		next(err);
	}
}

module.exports.getJournalEntryRange = async function(req, res, next) {
	let { range, scope } = req.query;
	let user = req.user;
	try {
		let range = util.getDateRange(scope);
		let entries = await JournalEntry.find({
			'user': user.id,
			'date': { $gte: range.start, $lte: range.end }
		}).select('date nutrition.logged').lean();

		res.json(entries);
	} catch(err) {
		next(err);
	}
}

module.exports.deleteJournalEntry = async function(req, res, next) {
	let { date } = req.params;
	let user = req.user;
	try {
		let entry = await JournalEntry.findOneAndDelete(
			{'user': user.id, 'date': date}
		);

		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${user.username} on ${date}.`);
		}

		res.status(204).send();
	} catch(err) {
		next(err);
	}
}

module.exports.addFoodToJournal = async function(req, res, next) {
	let { date } = req.params;
	let { meal } = req.query;
	let { cals, macros, loggedFoodId } = req.body;
	let user = req.user;
	try {
		userMeals = user.meals.map(m => {
			return {'name': m}
		});
		
		await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$setOnInsert: 
				{ 
					'nutrition.targets': user.targets.diet,
					'nutrition.meals': userMeals
				}
			},
			{ 'upsert': true, 'setDefaultsOnInsert': true }
		);

		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date, 'nutrition.meals.name': meal},
			{
				$inc: {
					'nutrition.logged.cals': cals,
					'nutrition.logged.macros.carbs.total': macros.carbs.total,
					'nutrition.logged.macros.carbs.sugars': macros.carbs.sugars,
					'nutrition.logged.macros.carbs.fiber': macros.carbs.fiber,
					'nutrition.logged.macros.protein': macros.protein,
					'nutrition.logged.macros.fats.total': macros.fats.total,
					'nutrition.logged.macros.fats.sat': macros.fats.sat,
					'nutrition.logged.macros.fats.poly': macros.fats.poly,
					'nutrition.logged.macros.fats.mono': macros.fats.mono,
					'nutrition.logged.macros.fats.trans': macros.fats.trans,
					'nutrition.meals.$.total.cals': cals,
					'nutrition.meals.$.total.macros.carbs.total': macros.carbs.total,
					'nutrition.meals.$.total.macros.carbs.sugars': macros.carbs.sugars,
					'nutrition.meals.$.total.macros.carbs.fiber': macros.carbs.fiber,
					'nutrition.meals.$.total.macros.protein': macros.protein,
					'nutrition.meals.$.total.macros.fats.total': macros.fats.total,
					'nutrition.meals.$.total.macros.fats.sat': macros.fats.sat,
					'nutrition.meals.$.total.macros.fats.poly': macros.fats.poly,
					'nutrition.meals.$.total.macros.fats.mono': macros.fats.mono,
					'nutrition.meals.$.total.macros.fats.trans': macros.fats.trans,
				},
				$push: { 'nutrition.meals.$.foods': loggedFoodId }
			},
			{new: true, lean: true}
		).select('nutrition').populate('nutrition.meals.foods').lean();
		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${user.username} on ${date}.`);
		}

		res.json(entry);
	} catch(err) {
		next(err);
	}
}

module.exports.removeFoodFromJournal = async function(req, res, next) {
	let { date } = req.params;
	let { meal } = req.query;
	let { loggedFoodId } = req.body;
	let user = req.user;

	try {
		let loggedFood = await LoggedFood.findById(loggedFoodId);
		if (!loggedFood) {
			res.status(404);
			return next(`No logged food found with id ${loggedFoodId}`)
		}
		let { cals, macros } = loggedFood.food;
		let entry = await JournalEntry.findOneAndUpdate(
			{ 
				'user': user.id, 
				'date': date,
				'nutrition.meals.name': meal,
				'nutrition.meals.foods': loggedFoodId 
			},
			{
				$inc: {
					'nutrition.logged.cals': -cals,
					'nutrition.logged.macros.carbs.total': -macros.carbs.total,
					'nutrition.logged.macros.carbs.sugars': -macros.carbs.sugars,
					'nutrition.logged.macros.carbs.fiber': -macros.carbs.fiber,
					'nutrition.logged.macros.protein': -macros.protein,
					'nutrition.logged.macros.fats.total': -macros.fats.total,
					'nutrition.logged.macros.fats.sat': -macros.fats.sat,
					'nutrition.logged.macros.fats.poly': -macros.fats.poly,
					'nutrition.logged.macros.fats.mono': -macros.fats.mono,
					'nutrition.logged.macros.fats.trans': -macros.fats.trans,				
					'nutrition.meals.$.total.cals': -cals,
					'nutrition.meals.$.total.macros.carbs.total': -macros.carbs.total,
					'nutrition.meals.$.total.macros.carbs.sugars': -macros.carbs.sugars,
					'nutrition.meals.$.total.macros.carbs.fiber': -macros.carbs.fiber,
					'nutrition.meals.$.total.macros.protein': -macros.protein,
					'nutrition.meals.$.total.macros.fats.total': -macros.fats.total,
					'nutrition.meals.$.total.macros.fats.sat': -macros.fats.sat,
					'nutrition.meals.$.total.macros.fats.poly': -macros.fats.poly,
					'nutrition.meals.$.total.macros.fats.mono': -macros.fats.mono,
					'nutrition.meals.$.total.macros.fats.trans': -macros.fats.trans
				},
				$pull: { 'nutrition.meals.$.foods': loggedFoodId }
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
	let { date } = req.params;
	let user = req.user;
	let targets = req.body;
	try {
		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$set: {
					'nutrition.targets': targets
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
	let { date } = req.params;
	let { waterAmount } = req.body;
	let user = req.user;	

	try {
		userMeals = user.meals.map(m => {
			return { 'name': m }
		});
		
		//TODO: Handle default empty values better
		await JournalEntry.findOneAndUpdate(
			{ 'user': user.id, 'date': date },
			{
				$setOnInsert: {
					'nutrition': {
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
				}
			},
			{ 'upsert': true, 'setDefaultsOnInsert': true }
		);

		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$inc: {
					'nutrition.water': waterAmount
				}
			},
			{new: true}
		).select('nutrition.water');

		if (!entry) {
			res.status(404);
			return next(`No journal found for ${user.username} on '${date}'`);
		}
		res.json(entry);
	} catch(err) {
		next(err);
	}
}

module.exports.getWaterIntake = async function(req, res, next) {
	let { date } = req.params;
	let { user } = req.user;
	try {
		let entry = await JournalEntry.findOne({
			'user': user.id, 'date': date
		}).select('nutrition.water -_id').lean();

		if (!entry) {
			res.status(404);
			return next(`No journal found for ${user.username} on '${date}'`);
		}

		res.json(entry);
	} catch(err) {
		next(err);
	}
}