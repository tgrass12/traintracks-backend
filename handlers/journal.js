const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const Food = require('../models/Food');
const LoggedFood = require('../models/LoggedFood');
const Meal = require('../models/Meal');
const ObjectId = require('mongoose').Types.ObjectId;
const util = require('../shared/util');

const createEntry = async function(user, date) {
	let entry = await JournalEntry.create({
		'user': user._id,
		'date': date,
		'nutrition': {
			'targets': user.targets.diet,
			'meals': user.meals.map(m => { return { 'name': m } }),
			'logged': {
				'energy': 0,
				'protein': 0,
				'totalCarbs': 0,
				'totalFats': 0,
			},
			'water': 0
		}
	});
	await entry.save();
	return entry;
}

module.exports.getJournalEntry = async function(req, res, next) {
	let { date } = req.params;
	let user = req.user;

	try {

		let entry = await JournalEntry.findOne({
			'user': user._id, 'date': date
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
			'user': user._id,
			'date': { $gte: range.start, $lte: range.end }
		}).select('date nutrition workouts').lean();

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
			{ 'user': user._id, 'date': date }
		);

		res.sendStatus(204);
	} catch(err) {
		next(err);
	}
}

module.exports.addFoodToJournal = async function(req, res, next) {
	let { date } = req.params;
	let { meal } = req.query;
	let { nutrients, loggedFoodId } = req.body;
	let user = req.user;

	try {
		let entry = await JournalEntry.findOne({ 'user': user._id, 'date': date });

		if (!entry) {
			entry = await createEntry(user, date);
			res.status(201);
		}

		entry = await JournalEntry.findOneAndUpdate(
			{
				'user': user._id,
				'date': date,
				'nutrition.meals.name': meal,
			},
			{
				$inc: {
					'nutrition.logged.energy': nutrients.energy,
					'nutrition.logged.totalCarbs': nutrients.totalCarbs,
					'nutrition.logged.sugars': nutrients.sugars,
					'nutrition.logged.fiber': nutrients.fiber,
					'nutrition.logged.protein': nutrients.protein,
					'nutrition.logged.totalFats': nutrients.totalFats,
					'nutrition.logged.saturatedFats': nutrients.saturatedFats,
					'nutrition.logged.polyUnsaturatedFats': nutrients.polyUnsaturatedFats,
					'nutrition.logged.monoUnsaturatedFats': nutrients.monoUnsaturatedFats,
					'nutrition.logged.transFats': nutrients.transFats,
					'nutrition.meals.$.total.energy': nutrients.energy,
					'nutrition.meals.$.total.totalCarbs': nutrients.totalCarbs,
					'nutrition.meals.$.total.sugars': nutrients.sugars,
					'nutrition.meals.$.total.fiber': nutrients.fiber,
					'nutrition.meals.$.total.protein': nutrients.protein,
					'nutrition.meals.$.total.totalFats': nutrients.totalFats,
					'nutrition.meals.$.total.saturatedFats': nutrients.saturatedFats,
					'nutrition.meals.$.total.polyUnsaturatedFats': nutrients.polyUnsaturatedFats,
					'nutrition.meals.$.total.monoUnsaturatedFats': nutrients.monoUnsaturatedFats,
					'nutrition.meals.$.total.transFats': nutrients.transFats
				},
				$push: { 'nutrition.meals.$.foods': loggedFoodId }
			},
			{ new: true }
		).populate('nutrition.meals.foods').lean();
		res.json(entry.nutrition);
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
		let { nutrients } = loggedFood.food;
		let entry = await JournalEntry.findOneAndUpdate(
			{
				'user': user._id,
				'date': date,
				'nutrition.meals.name': meal,
				'nutrition.meals.foods': loggedFoodId
			},
			{
				$inc: {
					'nutrition.logged.energy': -nutrients.energy,
					'nutrition.logged.totalCarbs': -nutrients.totalCarbs,
					'nutrition.logged.sugars': -nutrients.sugars,
					'nutrition.logged.fiber': -nutrients.fiber,
					'nutrition.logged.protein': -nutrients.protein,
					'nutrition.logged.totalFats': -nutrients.totalFats,
					'nutrition.logged.saturatedFats': -nutrients.saturatedFats,
					'nutrition.logged.polyUnsaturatedFats': -nutrients.polyUnsaturatedFats,
					'nutrition.logged.monoUnsaturatedFats': -nutrients.monoUnsaturatedFats,
					'nutrition.logged.transFats': -nutrients.transFats,
					'nutrition.meals.$.total.energy': -nutrients.energy,
					'nutrition.meals.$.total.totalCarbs': -nutrients.totalCarbs,
					'nutrition.meals.$.total.sugars': -nutrients.sugars,
					'nutrition.meals.$.total.fiber': -nutrients.fiber,
					'nutrition.meals.$.total.protein': -nutrients.protein,
					'nutrition.meals.$.total.totalFats': -nutrients.totalFats,
					'nutrition.meals.$.total.saturatedFats': -nutrients.saturatedFats,
					'nutrition.meals.$.total.polyUnsaturatedFats': -nutrients.polyUnsaturatedFats,
					'nutrition.meals.$.total.monoUnsaturatedFats': -nutrients.monoUnsaturatedFats,
					'nutrition.meals.$.total.transFats': -nutrients.transFats
				},
				$pull: { 'nutrition.meals.$.foods': loggedFoodId }
			},
			{ 'new': true }
		).populate('nutrition.meals.foods').lean();

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
		res.json(entry.nutrition);
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
			{'user': user._id, 'date': date},
			{
				$set: {
					'nutrition.targets': targets
				}
			},
			{ new: true }
		).lean();
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

		let entry = await JournalEntry.findOne({ 'user': user._id, 'date': date });

		if (!entry) {
			entry = await createEntry(user, date);
			res.status(201);
		}

		entry.nutrition.water += waterAmount;
		await entry.save();

		res.send(entry.nutrition);
	} catch(err) {
		next(err);
	}
}

module.exports.getWaterIntake = async function(req, res, next) {
	let { date } = req.params;
	let user = req.user;

	try {
		let entry = await JournalEntry.findOne({
			'user': user._id, 'date': date
		}).select('nutrition.water -_id').lean();

		if (!entry) {
			res.status(404);
			return next(`No journal found for ${user.username} on '${date}'`);
		}

		res.json(entry.nutrition);
	} catch(err) {
		next(err);
	}
}
