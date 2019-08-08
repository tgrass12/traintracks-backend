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

module.exports.getFood = async function(req, res, next) {
	let {id} = req.params;

	try {
		let food = await Food.findById(id).select('-__v').lean();
		res.json(food);
	} catch(err) {
		next(err);
	}
}

/* Add a new food to the Foods collection */
module.exports.addFood = async function(req, res, next) {
	let {name, cals, macros, micros} = req.body;
	
	try {
		let newFood = await Food.create({
			'name': name,
			'cals': cals,
			'macros': macros,
			'micros': micros
		});
		res.json(newFood);
	}
	catch(err) {
		next(err);
	}
};