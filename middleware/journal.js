const Food = require('../models/Food');
const LoggedFood = require('../models/LoggedFood');

const {
	addFoodToJournal,
	removeFoodFromJournal,
} = require('../handlers/journal');

const util = require('../shared/util');

module.exports.handleJournalEntryUpdate = function(req, res, next) {
	if (req.query.remove != null) {
		removeFoodFromJournal(req, res, next);
	}

	else {
		addFoodToJournal(req, res, next);
	}
}

module.exports.preprocessFood = async function(req, res, next) {
	let {food, servings} = req.body;
	if (food) {
		try {
			let foundFood = await Food.findById(food).select('-__v');
			if (!foundFood) {
				res.status(404);
				return next(`No food found with id ${food}`);
			}

			if (!servings || typeof servings !== 'number') {
				res.status(400);
				return next('Servings not provided or is of invalid type');
			}

			let loggedFood = await LoggedFood.create({
				servings: servings,
				food: foundFood
			});

			req.body.calories = loggedFood.food.calories;
			req.body.macros = loggedFood.food.macros;
			req.body.loggedFoodId = loggedFood._id;
			next();
		} catch(err) {
			next(err);
		}
	} else {
		next();
	}
}