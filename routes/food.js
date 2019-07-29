const router = require('express').Router({ mergeParams: true });

const { 
	addFood,
	getAllFoods 
} = require('../handlers/food');

router.route('/')
	.get(getAllFoods)
	.post(addFood);

module.exports = router;