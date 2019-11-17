const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DataUsers = require('../models/user')

//passport login
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true
},
function(username, password, done) {
    DataUsers.findOne({'email': username}, function(err, user) {
        if (err) { 
            return done(err);
        }
        else if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        else if (user.validPassword(password) == false) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    DataUsers.findById(id, function(err, user) {
        done(err, user);
    })
})