const passport = require('passport');
const express = require('express');
const router = express.Router();
const uservalidate = require('../middleware/checkPermission');

//local-login
router.get('/', function(req, res, next) {
  res.render("index");
});

router.post('/',uservalidate.checkInputLogin, passport.authenticate("local.login", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


module.exports = router;
