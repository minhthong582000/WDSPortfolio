const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userService = require('../services/userService');
const Joi = require('@hapi/joi');
const passportJWT = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTSECRET || 'thongdz';

passport.use('passport.jwt', new passportJWT(opts, (payload, done)=>{
  Post.findById(payload.user._id, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password' });
    };
    return done(null, user);
  })
}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true,
}, async function (req, email, pass, done) {
    try {
        const signUpSchema = Joi.object({
            email: Joi.string().email().required(),
            pwd: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
            birthday: Joi.number().integer().min(1900).max(2100),
            university: Joi.string(),
            studentID: Joi.string().required()
        }).unknown(false);
        let DTO = req.body;
        let valid = signUpSchema.validate(DTO, { abortEarly: false });
        if (valid.error) {
            return done(null, false, { statusCode: 401, status: 'unauthorized', msg: valid.error.details.map(err=>err.message) });
        }
        let user = await userService.userExist(DTO.email, DTO.studentID);
        if (user) {
            return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['Your email or studentID already existed'] });
        } else {
            let newUser = await userService.createUser(DTO);
            if (newUser) {
                return done(null, newUser, { statusCode: 200, status: 'authorized' });
            }
            else return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['Unable to create your account'] });
        } 
    } catch(err) {
        console.log(err);
    }
}
));