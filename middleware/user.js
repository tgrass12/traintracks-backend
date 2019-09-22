const User = require('../models/User');

module.exports.findUser = async function(req, res, next) {
	try {
		let user = await User.findByUsername(req.params.username).lean();
		if (!user) {
			res.status(404);
			return next(`No user found with username ${username}`);
		}

		req.user = user;
		next();

	} catch(err) {
		next(err);
	}
}