const router = require('express').Router({ mergeParams: true });
const journalRoutes = require('./journal');
const {
	getGoals,
	setGoals
} = require('../handlers/user');

router.route('/:username/goals')
	.get(getGoals)
	.patch(setGoals);

router.use('/:username/journal', journalRoutes);

module.exports = router;