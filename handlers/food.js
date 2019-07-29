const Food = require('../models/Food');


/* Get all foods in the Foods collection */
module.exports.getAllFoods = async function(req, res, next) {
	let foods = await Food.find({}).exec((err, foods) => {
		if (err) res.status(500).json(err);

		res.json(foods);
	});
}

/* Add a new food to the Foods collection */
module.exports.addFood = async function(req, res, next) {
	let {name, calories, macros} = req.body;
	
	let food = await Food.create({
		'name': name,
		'calories': calories,
		'macros': macros
	}).exec((err, newFood) => {
		if (err) res.status(500).json(err);
		res.json(newFood);
	});
};