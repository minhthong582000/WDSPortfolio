const url = require("url");
const { AccessControl } = require('./accessControl');
const passport = require("passport");

module.exports.hasPermission = function (req, res, next) {
    const path = url.format({
        pathname: req.originalUrl
    });
    const method = req.method;
    if(AccessControl.isSimpleUrl(path, method)) {
        next();
    }
    if(AccessControl.isAuthUrl(path, method)) {
        if(!req.header('Authorization')) {
            res.status(401).send('requires authentication');
        }
        else{
            passport.authenticate('passport.jwt', { session: false }, function  (err, user, result) {
                let valid = new AccessControl( path, method, user.role);
                if(valid.isAllowed()) {
                    next();
                }
                else {
                    res.status(405).send("Not Allow");
                }
            })(req, res, next);
        }
    }
    
}


