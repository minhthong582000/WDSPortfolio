var express = require('express');
var router = express.Router();
const passport = require("passport");
const account = require('../controller/userController')
/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });
// router.post('/',
//   passport.authenticate('local.signup')
// );
// router.post('/',passport.authenticate('local-signup') 
// );
router.post('/',
    passport.authenticate('local-signup'));
module.exports = router;
