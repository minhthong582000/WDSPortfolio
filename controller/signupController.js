const passport = require("passport");
const jwt = require('jsonwebtoken');

module.exports.passportLocal = (req, res, next)=>{
    if (req.body.email && req.body.pwd) {
        passport.authenticate('local-signup', {session: false } ,function (err, user, info) {
            if (err) return next(err);
            if(user)
                req.login(user, { session: false }, (err) => {
                    if (err) 
                        res.send(err);
                    // generate a signed json web token with the contents of user object and return it
                    const token = jwt.sign({ user }, process.env.JWTSECRET || 'thongdz');
                    return res.json({user, "token": token});
                });
            else 
                res.status(info.statusCode).send(info.msg);
        })(req, res, next);
    }
    else {
        res.status(401).send({ statusCode: 401, status: 'unauthorized', msg: ['email or password is empty'] })
    }
}