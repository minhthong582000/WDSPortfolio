const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DataUsers = require('../models/user')
const userController = require('../controller/signup-controller')

//phần này đang error nên tạm comment(Dưa Hauz)
// passport.use('local-signup', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'pwd',
//     passReqToCallback: true,
// }, userController.createNewAccount));


passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    DataUsers.findById(id, function(err, user) {
        if (err) {
            return done(null, false)
        } else {
            return done(null, user)
        }
    })
})

