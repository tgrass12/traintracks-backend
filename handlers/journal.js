const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const Food = require('../models/Food');
const Meal = require('../models/Meal');
const util = require('../shared/util');
const ObjectId = require('mongoose').Types.ObjectId;

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
		});

		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${username} on ${date}.`);
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
		}).select('date diet.total');

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

module.exports.addMiscToJournal = async function(req, res, next) {
	let {username, date} = req.params;
	let {calories, macros} = req.body;

	try {
		let user = await User.findByUsername(username);
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}
		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$inc: {
					'diet.total.calories': calories,
					'diet.total.macros.carbohydrates.total': macros.carbohydrates.total,
					'diet.total.macros.carbohydrates.sugars': macros.carbohydrates.sugars,
					'diet.total.macros.carbohydrates.fiber': macros.carbohydrates.fiber,
					'diet.total.macros.protein': macros.protein,
					'diet.total.macros.fats.total': macros.fats.total,
					'diet.total.macros.fats.saturated': macros.fats.saturated,
					'diet.total.macros.fats.polyUnsaturated': macros.fats.polyUnsaturated,
					'diet.total.macros.fats.monoUnsaturated': macros.fats.monoUnsaturated,
					'diet.total.macros.fats.trans': macros.fats.trans,
					'diet.manual.calories': calories,
					'diet.manual.macros.carbohydrates.total': macros.carbohydrates.total,
					'diet.manual.macros.carbohydrates.sugars': macros.carbohydrates.sugars,
					'diet.manual.macros.carbohydrates.fiber': macros.carbohydrates.fiber,
					'diet.manual.macros.protein': macros.protein,
					'diet.manual.macros.fats.total': macros.fats.total,
					'diet.manual.macros.fats.saturated': macros.fats.saturated,
					'diet.manual.macros.fats.polyUnsaturated': macros.fats.polyUnsaturated,
					'diet.manual.macros.fats.monoUnsaturated': macros.fats.monoUnsaturated,
					'diet.manual.macros.fats.trans': macros.fats.trans
				},
				$setOnInsert: {
					'diet.targets': user.targets.diet
				}
			},
			{new: true, upsert: true}
		);

		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${username} on ${date}.`);
		}

		res.json(entry.diet);
	} catch(err) {
		next(err);
	}
}

module.exports.addFoodToJournal = async function(req, res, next) {
	let {username, date} = req.params;
	let {meal} = req.query;
	let {calories, macros, food, servings} = req.body;

	try {
		let user = await User.findByUsername(username);
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);			
		}

		userMeals = user.meals.map(m => {
			return {'name': m.toLowerCase()}
		});
		
		await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$setOnInsert: 
				{ 
					'targets': user.targets.diet,
					'meals': [...userMeals]
				}
			},
			{ 'upsert': true }
		);
		entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date, 'meals.name': meal.toLowerCase()},
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
				$push: { 'meals.$.foods':  {'food': food, 'servings': servings }}
			},
			{new: true}
		);
		if (!entry) {
			res.status(404);
			return next(`No entry found for user ${username} on ${date}.`);
		}

		res.json(entry);
	} catch(err) {
		next(err);
	}
}

module.exports.removeMiscFromJournal = async function(req, res, next) {
	let {username, date} = req.params;
	let {calories, macros} = req.body;

	try {
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOneAndUpdate(
			{ 
				'user': user.id, 
				'date': date,
			},
			{
				$inc: {
					'diet.total.calories': -calories,
					'diet.total.macros.carbohydrates.total': -macros.carbohydrates.total,
					'diet.total.macros.carbohydrates.sugars': -macros.carbohydrates.sugars,
					'diet.total.macros.carbohydrates.fiber': -macros.carbohydrates.fiber,
					'diet.total.macros.protein': -macros.protein,
					'diet.total.macros.fats.total': -macros.fats.total,
					'diet.total.macros.fats.saturated': -macros.fats.saturated,
					'diet.total.macros.fats.polyUnsaturated': -macros.fats.polyUnsaturated,
					'diet.total.macros.fats.monoUnsaturated': -macros.fats.monoUnsaturated,
					'diet.total.macros.fats.trans': -macros.fats.trans,
					'diet.manual.calories': -calories,
					'diet.manual.macros.carbohydrates.total': -macros.carbohydrates.total,
					'diet.manual.macros.carbohydrates.sugars': -macros.carbohydrates.sugars,
					'diet.manual.macros.carbohydrates.fiber': -macros.carbohydrates.fiber,
					'diet.manual.macros.protein': -macros.protein,
					'diet.manual.macros.fats.total': -macros.fats.total,
					'diet.manual.macros.fats.saturated': -macros.fats.saturated,
					'diet.manual.macros.fats.polyUnsaturated': -macros.fats.polyUnsaturated,
					'diet.manual.macros.fats.monoUnsaturated': -macros.fats.monoUnsaturated,
					'diet.manual.macros.fats.trans': -macros.fats.trans
				}
			},
			{new: true}
		);

		res.status(200).json(entry);
	}

	catch(err) {
		next(err);
	}
}

module.exports.removeFoodFromJournal = async function(req, res, next) {
	let {username, date} = req.params;
	let {meal} = req.query;
	let {calories, macros, loggedFoodId} = req.body;
	try {
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOneAndUpdate(
			{ 
				'user': user.id, 
				'date': date,
				'meals.name': meal.toLowerCase(),
				'meals.foods._id': ObjectId(loggedFoodId) 
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
				$pull: { 'meals.$.foods': { _id: ObjectId(loggedFoodId)  }}
			},
			{new: true}
		);

		if (!entry) {
			return next('Food not found in the journal entry');
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
					'diet.targets': targets
				}
			},
			{new: true}
		)
		res.json(entry.diet.targets);
	} catch(err) {
		next(err);
	}
}