const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const userController = require('../controller/signupController');

router.use(passport.authenticate('passport.jwt', { session: false }), (req, res, next)=>{
    next();
})

router.post('/', userController.passportLocal);

module.exports = router;
