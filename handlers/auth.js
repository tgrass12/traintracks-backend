const User = require('../models/User');

module.exports.registerUser = async function(req, res, next) {
	try {
		let user = await User.create(req.body);
		res.status(200).json(user);
	} catch(err) {
		return next(err);
	}
}