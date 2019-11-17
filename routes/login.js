var express = require('express');
const passport = require('passport');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', passport.authenticate("local.login", {
  successRedirect: '.....?',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;
