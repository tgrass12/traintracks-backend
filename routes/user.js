const router = require('express').Router({ mergeParams: true });
const journalRoutes = require('./journal');
const {
	getTargets,
	setTargets,
	getMeals
} = require('../handlers/user');

router.route('/:username/targets')
	.get(getTargets)
	.patch(setTargets);

router.route('/:username/meals')
	.get(getMeals);

router.use('/:username/journal', journalRoutes);

module.exports = router;