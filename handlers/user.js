const User = require('../models/User');

module.exports.getTargets = async function(req, res, next) {
	let {username} = req.params;
	try {
		let user = await User.findByUsername(username);
		res.json(user.targets);
	} catch(err) {
		next(err);
	}
}

/* Set a user's target targets (ex. 2000 cals/day) */
module.exports.setTargets = async function(req, res, next) {
	let {username} = req.params;
	let {targets} = req.body;
	try {
		let user = await User.findOneAndUpdate(
			{ 'username': username },
			{
				'targets': targets
			},
			{ new: true }
		);
		res.json(user.targets);
	} catch(err) {
		next(err);
	}
}

module.exports.getMeals = async function(req, res, next) {
	let {username} = req.params;
	try {
		let user = await User.findByUsername(username);
		res.json(user.meals);
	} catch(err) {
		next(err);
	}
}