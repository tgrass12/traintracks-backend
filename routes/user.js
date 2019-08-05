const router = require('express').Router({ mergeParams: true });
const journalRoutes = require('./journal');
const {
	getTargets,
	setTargets
} = require('../handlers/user');

router.route('/:username/targets')
	.get(getTargets)
	.patch(setTargets);

router.use('/:username/journal', journalRoutes);

module.exports = router;