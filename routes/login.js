const passport = require('passport');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.post('/', passport.authenticate("local.login", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


module.exports = router;
