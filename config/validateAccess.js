const url = require("url");
const { AccessControl } = require('./accessControl');
const passport = require("passport");

module.exports.hasPerms = function (req, res, next) {
    passport.authenticate('passport.jwt', { session: false }, function  (err, user, result) {
        const path = url.format({
            pathname: req.originalUrl
        });
        const method = req.method;
        let valid = new AccessControl( path, method, user.role);
        if(valid.isAllowed()) next();
        else res.send("not allow");
    })(req, res, next);
}


