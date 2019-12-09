const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DataUsers = require('../models/user')

//local login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async function(req,username, password, done) { 
    const criteria = (username.indexOf('@') === -1) ? {studentID: username} : {email: username}; //kiểm tra username là email hay mssv => check database
    DataUsers.findOne(criteria,function(err, user) {
        if (err) { 
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null,user);
    });
}));

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

