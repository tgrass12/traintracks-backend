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
		}).populate('meals.foods').lean(true);
		
		if (!entry) {
			entry = await JournalEntry.createJournalFrame(user.meals, user.targets.diet);
		}

		res.json(entry);

	} catch(err) {
		next(err);
	}
}

module.exports.getJournalEntryRange = async function(req, res, next) {
	let {username} = req.params;
	let {range, date} = req.query;

	try {
		let user = await User.findByUsername(username);
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}

		let range = util.getDateRange(date);
		let entries = await JournalEntry.find({
			'user': user.id,
			'date': { $gte: range.start, $lte: range.end }
		}).select('date total').lean(true);

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
	let {calories, macros, loggedFoodId} = req.body;
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
			{ 'upsert': true }
		);
		entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date, 'meals.name': meal},
			{
				$inc: {
					'total.calories': calories,
					'total.macros.carbohydrates.total': macros.carbohydrates.total,
					'total.macros.carbohydrates.sugars': macros.carbohydrates.sugars,
					'total.macros.carbohydrates.fiber': macros.carbohydrates.fiber,
					'total.macros.protein': macros.protein,
					'total.macros.fats.total': macros.fats.total,
					'total.macros.fats.saturated': macros.fats.saturated,
					'total.macros.fats.polyUnsaturated': macros.fats.polyUnsaturated,
					'total.macros.fats.monoUnsaturated': macros.fats.monoUnsaturated,
					'total.macros.fats.trans': macros.fats.trans,
					'meals.$.total.calories': calories,
					'meals.$.total.macros.carbohydrates.total': macros.carbohydrates.total,
					'meals.$.total.macros.carbohydrates.sugars': macros.carbohydrates.sugars,
					'meals.$.total.macros.carbohydrates.fiber': macros.carbohydrates.fiber,
					'meals.$.total.macros.protein': macros.protein,
					'meals.$.total.macros.fats.total': macros.fats.total,
					'meals.$.total.macros.fats.saturated': macros.fats.saturated,
					'meals.$.total.macros.fats.polyUnsaturated': macros.fats.polyUnsaturated,
					'meals.$.total.macros.fats.monoUnsaturated': macros.fats.monoUnsaturated,
					'meals.$.total.macros.fats.trans': macros.fats.trans,
				},
				$push: { 'meals.$.foods': loggedFoodId }
			},
			{new: true}
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
		let {calories, macros} = loggedFood.food;
		let entry = await JournalEntry.findOneAndUpdate(
			{ 
				'user': user.id, 
				'date': date,
				'meals.name': meal,
				'meals.foods': loggedFoodId 
			},
			{
				$inc: {
					'total.calories': -calories,
					'total.macros.carbohydrates.total': -macros.carbohydrates.total,
					'total.macros.carbohydrates.sugars': -macros.carbohydrates.sugars,
					'total.macros.carbohydrates.fiber': -macros.carbohydrates.fiber,
					'total.macros.protein': -macros.protein,
					'total.macros.fats.total': -macros.fats.total,
					'total.macros.fats.saturated': -macros.fats.saturated,
					'total.macros.fats.polyUnsaturated': -macros.fats.polyUnsaturated,
					'total.macros.fats.monoUnsaturated': -macros.fats.monoUnsaturated,
					'total.macros.fats.trans': -macros.fats.trans,				
					'meals.$.total.calories': -calories,
					'meals.$.total.macros.carbohydrates.total': -macros.carbohydrates.total,
					'meals.$.total.macros.carbohydrates.sugars': -macros.carbohydrates.sugars,
					'meals.$.total.macros.carbohydrates.fiber': -macros.carbohydrates.fiber,
					'meals.$.total.macros.protein': -macros.protein,
					'meals.$.total.macros.fats.total': -macros.fats.total,
					'meals.$.total.macros.fats.saturated': -macros.fats.saturated,
					'meals.$.total.macros.fats.polyUnsaturated': -macros.fats.polyUnsaturated,
					'meals.$.total.macros.fats.monoUnsaturated': -macros.fats.monoUnsaturated,
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
			return next(`No journal found for ${username} for date '${date}'`);
		}
		res.json(entry);
	} catch(err) {
		next(err);
	}
}