const express = require('express');
const router = express.Router();
const passport = require("passport");
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
  next();
});
// router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }
// ));
// router.get('/auth/google/callback', passport.authenticate('google'), (req, res,next) => {
//   res.redirect('/')
// });
module.exports = router;
