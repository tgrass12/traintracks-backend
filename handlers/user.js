const User = require('../models/User');

module.exports.getGoals = async function(req, res, next) {
	let {username} = req.params;
	try {
		let user = await User.findByUsername(username);
		res.json(user.goals);
	} catch(err) {
		next(err);
	}
}

/* Set a user's target goals (ex. 2000 cals/day) */
module.exports.setGoals = async function(req, res, next) {
	let {username} = req.params;
	let {goals} = req.body;
	try {
		let user = await User.findOneAndUpdate(
			{ 'username': username },
			{
				'goals': goals
			},
			{ new: true }
		);
		res.json(user.goals);
	} catch(err) {
		next(err);
	}
}