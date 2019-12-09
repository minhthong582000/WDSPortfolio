const passport = require('passport');
const express = require('express');
const router = express.Router();
const { validate, keyValidate } = require('../middleware/checkPermission');

//local-login
router.get('/', function(req, res, next) {
  var messages = req.flash("error");
  res.render("index", { messages });
  next();
});

router.post('/',validate(keyValidate), passport.authenticate("local.login", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


module.exports = router;
