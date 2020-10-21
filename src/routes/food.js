const router = require('express').Router({ mergeParams: true });

const { addFood, queryFoods, getFood } = require('../handlers/food');

router.route('/').get(queryFoods).post(addFood);

router.route('/:id').get(getFood);

module.exports = router;
