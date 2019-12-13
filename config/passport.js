const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userController = require('../controller/userController');
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true,
}, userController.createNewAcountLocal));

// passport.use('google', new GoogleStrategy({
//     clientID: "455966369589-laui062rb2luc229f84o78rb2opbk31v.apps.googleusercontent.com",
//     clientSecret: "mJDgzK17QB8o502KJ3_gltPe",
//     callbackURL: "/login/auth/google/callback"
// }, userController.googleLogin));
