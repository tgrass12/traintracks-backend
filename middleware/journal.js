const Food = require('../models/Food');

const {
	addMiscToJournal,
	addFoodToJournal,
	removeFoodFromJournal,
	removeMiscFromJournal,
} = require('../handlers/journal');

const util = require('../shared/util');

module.exports.handleJournalEntryUpdate = function(req, res, next) {
	if (req.query.remove != null) {
		if (req.body.loggedFoodId) {
			removeFoodFromJournal(req, res, next);
		} else {
			removeMiscFromJournal(req, res, next);
		}
	}

	else {
		if (req.body.food) {
			addFoodToJournal(req, res, next);
		}
		else {
			addMiscToJournal(req, res, next);
		}
	}
}

module.exports.parseFood = async function(req, res, next) {
	let {food, servings} = req.body;
	if (food) {
		try {
			let foodDoc = await Food.findById(food).lean().select('-__v');

			if (!foodDoc) {
				res.status(404);
				return next(`No food found with id ${food}`);
			}
			let {calories, macros} = util.deepMapNumber(foodDoc, (v) => v * servings);
			req.body.calories = calories;
			req.body.macros = macros;
			next();
		} catch(err) {
			next(err);
		}
	} else {
		next();
	}
}