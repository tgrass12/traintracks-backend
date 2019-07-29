const express = require('express');
const router = express.Router({ mergeParams: true });

const { registerUser } = require('../handlers/auth');

router.route('/register').post(registerUser);

module.exports = router;

