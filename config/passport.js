const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DataUsers = require('../models/user')
const userController = require('../controller/signup-controller')

//local login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async function(req,username, password, done) { 
    const criteria = (username.indexOf('@') === -1) ? {studentID: username} : {email: username}; //kiểm tra username là email hay mssv để check database
    DataUsers.findOne(criteria,function(err, user) {
        if (err) { 
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        if (password != '1234567') {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
    });
}));

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

