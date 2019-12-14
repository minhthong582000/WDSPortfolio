const express = require('express');
const router = express.Router();
const userController = require('../controller/signupController');

router.post('/', userController.passportLocal);

module.exports = router;
