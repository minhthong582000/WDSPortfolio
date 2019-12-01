const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const DataUsers = require('../models/user')
const { check, validationResult } = require('express-validator');


//login with facebook
passport.use('facebook',new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/login/auth/facebook/callback",
    profileFields: ['emails', 'picture.type(large)', 'link']
  },async function(accessToken, refreshToken, profile, done) {
      const picture = "https://graph.facebook.com/" + profile.id + "/picture?width=200&height=200&access_token=" + accessToken; //avatar fb của user khi login = fb
        DataUsers.findOne({'facebook.id': profile.id},function(err,user){
            if(err){
                return done(err);
            }
            if(user){
                return done(null,user);
            }
            else{
                var newUser = new DataUsers();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.email = profile.emails[0].value;

                newUser.save(function(err){
                    if(err){
                        throw err;
                    }
                    else
                    return done(null,newUser);
                })
            }
        })
    }
));

//local login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async function(req,username, password, done) {
    //hàm check có lỗi khi input username hoặc password
    const validate =  validations => {
        return async (req, res, next) => {
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({errors: errors.array()}); /*trả ra dữ liệu json với errors là array dạng 
                                                                    errors: [{  "location": "body",
                                                                        "msg": "Invalid value",
                                                                        "param": "username"}]
                                                                    }]*/
            }
        };
    };

    validate([
        check('username').not().isEmpty().isLength({min: 5, max: 30}).custom(function(value){
        //kiểm tra username có là email hoặc mssv hay ko, nếu sai => throw error, ngừng check database
        const emailRegex = /\S+@\S+\.\S+/i;
        const studentIDRegex = /([0-9]){8}/i;
        if(emailRegex.test(value) || studentIDRegex.test(value)){
          return true;
        }
        else
          throw new Error('Sorry,You must use email or student ID');
        }),
        check('password').not().isEmpty().isLength({min: 5, max: 30}) // kiểm tra password
    ]);
    
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

