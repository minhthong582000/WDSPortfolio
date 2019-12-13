var express = require('express');
var router = express.Router();
const passport = require("passport");
<<<<<<< HEAD
//normal callback
// router.post('/', passport.authenticate('local-signup', { session: false }),
//     function (req, res, next) {
//         res.json({message:'Signup Success'});
//         next()
//     });
// for custom callback
router.post('/local', function (req, res, next) {
    if (req.body.email && req.body.pwd) {
        passport.authenticate('local', function (err, user, info) {
            if (err) return next(err)
            if (info)
                res.status(info.statusCode).send(info);
        })(req, res, next);
    }
    else {
        res.status(401).send({ statusCode: 401, status: 'unauthorized', msg: ['email or password is empty'] })
    }
});
=======
>>>>>>> a950f3e0d92fbd1b08e5b6c70c02640c1dd579b1

module.exports = router;
