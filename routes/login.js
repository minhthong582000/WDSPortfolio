const passport = require('passport');
const express = require('express');
const router = express.Router();

//local-login
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.post('/', passport.authenticate("local.login", {
  successRedirect: '/',
  failureRedirect: '/login',
}));

//login with facebook
router.get('/auth/facebook',passport.authenticate('facebook',{ scope : ['email'] }));
router.get('/auth/facebook/callback',passport.authenticate('facebook', { 
  successRedirect: '/',
  failureRedirect: '/login'
}));


module.exports = router;
