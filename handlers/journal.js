const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const Food = require('../models/Food');
const Meal = require('../models/Meal');
const util = require('../shared/util');
const ObjectId = require('mongoose').Types.ObjectId;

let quantifyFoods = function(foods) {
	let quantifiedFoods = [];
	for (let foodWithServings of foods) {
		let servingSize = foodWithServings.servings;
		let quantifiedFood = util.deepMapNumber(
			foodWithServings.food,
			(item) => item * servingSize
		);
		quantifiedFoods.push({
			'_id': foodWithServings._id,
			'servings': servingSize,
			'food': quantifiedFood
		});
	}
	return quantifiedFoods;
}

module.exports.getJournalEntry = async function(req, res, next) {
	let {username} = req.params;
	let {date} = req.query;
	try {
		let user = await User.findByUsername(username);

		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}
		let entry = await JournalEntry.findOne({
			'user': user.id, 'date': date
		}).populate({
			'path': 'meals.foods.food',
			'select': '-_id -__v',
		}).lean(true);
		
		if (!entry) {
			entry = await JournalEntry.createJournalFrame(user.meals, user.targets.diet);
		}

		else {
			for (let i = 0; i < entry.meals.length; i++) {
				entry.meals[i].foods = quantifyFoods(entry.meals[i].foods);
			}
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
		}).select('date total');

		res.json(entries);
	} catch(err) {
		next(err);
	}
}

module.exports.deleteJournalEntry = async function(req, res, next) {
	let {username} = req.params;
	let {date} = req.query;

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
	let {username} = req.params;
	let {date} = req.query;
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
					'manual.calories': calories,
					'manual.macros.carbohydrates.total': macros.carbohydrates.total,
					'manual.macros.carbohydrates.sugars': macros.carbohydrates.sugars,
					'manual.macros.carbohydrates.fiber': macros.carbohydrates.fiber,
					'manual.macros.protein': macros.protein,
					'manual.macros.fats.total': macros.fats.total,
					'manual.macros.fats.saturated': macros.fats.saturated,
					'manual.macros.fats.polyUnsaturated': macros.fats.polyUnsaturated,
					'manual.macros.fats.monoUnsaturated': macros.fats.monoUnsaturated,
					'manual.macros.fats.trans': macros.fats.trans
				},
				$setOnInsert: {
					'targets': user.targets.diet
				}
			},
			{new: true, upsert: true}
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

module.exports.addFoodToJournal = async function(req, res, next) {
	let {username} = req.params;
	let {meal, date} = req.query;
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
	let {username} = req.params;
	let {date} = req.query;
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
					'manual.calories': -calories,
					'manual.macros.carbohydrates.total': -macros.carbohydrates.total,
					'manual.macros.carbohydrates.sugars': -macros.carbohydrates.sugars,
					'manual.macros.carbohydrates.fiber': -macros.carbohydrates.fiber,
					'manual.macros.protein': -macros.protein,
					'manual.macros.fats.total': -macros.fats.total,
					'manual.macros.fats.saturated': -macros.fats.saturated,
					'manual.macros.fats.polyUnsaturated': -macros.fats.polyUnsaturated,
					'manual.macros.fats.monoUnsaturated': -macros.fats.monoUnsaturated,
					'manual.macros.fats.trans': -macros.fats.trans
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

//TODO: Doesn't work right now, gotta figure out a better design for this..
module.exports.removeFoodFromJournal = async function(req, res, next) {
	let {username} = req.params;
	let {meal, date} = req.query;
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
	let {username} = req.params;
	let {date} = req.query;
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