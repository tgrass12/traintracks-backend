const router = require('express').Router({ mergeParams: true });

const { 
	addFood,
	getAllFoods,
	getFood
} = require('../handlers/food');

router.route('/')
	.get(getAllFoods)
	.post(addFood);

router.route('/:id')
	.get(getFood);

module.exports = router;