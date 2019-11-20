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
router.post('/', passport.authenticate('local-signup', { session: false }),
    function (req, res, next) {
        res.json({message:'Signup Success'});
        next()
    });
// router.post('/', function (req, res, next) {
//     passport.authenticate('local-signup', function (err, user, info) {
//         if (err) return next(err)
//         if (info)
//             res.status(info.statusCode).send(info) ;
//     })(req, res, next);
// });

module.exports = router;
