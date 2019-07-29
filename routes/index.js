const express = require('express');
const router = express.Router({ mergeParams: true });
const authRoutes = require('./auth');
const foodRoutes = require('./food');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/foods', foodRoutes);
router.use('/users', userRoutes);

module.exports = router;