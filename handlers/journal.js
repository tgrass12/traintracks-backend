const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const Food = require('../models/Food');
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
					'diet.goals': user.goals.diet
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
	let {calories, macros, food, servings} = req.body;

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
					'diet.total.macros.fats.trans': macros.fats.trans
				},
				$setOnInsert: {
					'diet.goals': user.goals.diet
				},
				$push: {
					'diet.foods': {'food': food, 'servings': servings}
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
	let {calories, macros, totalFoodId} = req.body;

	try {
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOneAndUpdate(
			{ 
				'user': user.id, 
				'date': date,
				'diet.total.foods': { $elemMatch: { _id: totalFoodId } }
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
					'diet.total.macros.fats.trans': -macros.fats.trans
				},
				$pull: { 'diet.foods': { $elemMatch: { _id: totalFoodId } } }
			},
			{new: true}
		);

		if (!entry) {
			return next('Food not found in the journal entry');
		}
		res.status(200).json(entry.diet);
	}

	catch(err) {
		next(err);
	}
}

module.exports.setJournalEntryGoals = async function(req, res, next) {
	let {username, date} = req.params;
	let goals = req.body;
	try {
		let user = await User.findByUsername(username);
		let entry = await JournalEntry.findOneAndUpdate(
			{'user': user.id, 'date': date},
			{
				$set: {
					'diet.goals': goals
				}
			},
			{new: true}
		)
		res.json(entry.diet.goals);
	} catch(err) {
		next(err);
	}
}