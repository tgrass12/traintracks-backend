const User = require('../models/User');

module.exports.register = async function(req, res, next) {
	try {
		const { username, password } = req.body;
		const newUser = new User({ username: username });
		const user = await User.register(newUser, password);

		req.session.user = username;
		res.status(200).json(user);
	} catch(err) {
		return next(err);
	}
}

module.exports.login = async function(req, res, next) {
	try {
		const { username, password } = req.body;
		const userToLogin = await User.findByUsername(username);

		if (!userToLogin) {
			res.status(401);
			return next('Username or password is invalid.');
		}
		
		const authResult = await userToLogin.authenticate(password);

		if (!authResult.user) {
			res.status(401);
			return next(authResult.error.message);
		}

		req.session.user = username;
		res.status(200).json(userToLogin);
	} catch(err) {
		next(err);
	}
}

module.exports.logout = function(req, res, next) {
  req.session.destroy(function (err) {
  	res.clearCookie('connect.sid');
    res.sendStatus(204);
  });
}

module.exports.getSession = async function(req, res, next) {
	try {
		const user = await User.findByUsername(req.session.user);
		res.json(user);
	} catch(err) {
		next(err);
	}
}