const router = require('express').Router({ mergeParams: true });
const journalRoutes = require('./journal');
const {
  initNewUser,
  getUser,
  getTargets,
  setTargets,
  getMeals,
} = require('../handlers/user');

const { findUser } = require('../middleware/user');

router.route('/:username').get(getUser);

router.route('/:username/init').patch(initNewUser);

router.route('/:username/targets').get(getTargets).patch(setTargets);

router.route('/:username/meals').get(getMeals);

router.use('/:username/journal', findUser, journalRoutes);

module.exports = router;
