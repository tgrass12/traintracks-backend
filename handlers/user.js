const User = require('../models/User');

module.exports.getUser = async function(req, res, next) {
	let { username } = req.params;

	try {
		let user = await User.findOne(
			{ 'username': username }
		).lean().select('-__v');

		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}

		res.json(user);
	} catch(err) {
		next(err);
	}
}

module.exports.getTargets = async function(req, res, next) {
	let { username } = req.params;
	try {
		let targets = await User.findOne(
			{ 'username': username }
		).lean().select('-_id targets');

		if (!targets) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}
		res.json(targets);
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
	let { username } = req.params;
	try {
		let meals = await User.findOne(
			{ 'username': username }
		).lean().select('-_id meals');

		if (!meals) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}

		res.json(meals);
	} catch(err) {
		next(err);
	}
}