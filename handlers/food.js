const Food = require('../models/Food');


/* Get all foods in the Foods collection */
module.exports.getAllFoods = async function(req, res, next) {
	try {
		let foods = await Food.find({});
		res.json(foods);
	}
	catch (err) {
		next(err)
	}
}

/* Add a new food to the Foods collection */
module.exports.addFood = async function(req, res, next) {
	let {name, calories, macros} = req.body;
	
	try {
		let newFood = await Food.create({
			'name': name,
			'calories': calories,
			'macros': macros
		});
		res.json(newFood);
	}
	catch(err) {
		next(err);
	}
};