const express = require('express');
const router = express.Router({ mergeParams: true });

const { register, login, logout, getSession } = require('../handlers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/session').get(getSession);
module.exports = router;
