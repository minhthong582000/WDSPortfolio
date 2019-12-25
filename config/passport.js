const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Joi = require('@hapi/joi');
const userService = require('../services/userService');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTSECRET || 'thongdz';

passport.use('passport.jwt', new passportJWT(
    opts,
    async (payload, done)=>{
        let user = await userService.findByID(payload.user._id);
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        };
        return done(null, user);
      }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback: true,
}, async function (req, email, pass, done) {
    const signUpSchema = Joi.object({
        email: Joi.string().email().required(),
        pwd: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
        birthday: Joi.number().integer().min(1900).max(2100),
        university: Joi.string().required(),
        studentID: Joi.string().required()
    }).unknown(true);
    let DTO = req.body;
    let valid = await signUpSchema.validate(DTO, { abortEarly: false });
    if (valid.error) {
        return done(null, false, { statusCode: 401, status: 'unauthorized', msg: await valid.error.details.map(err => err.message) });
    } else {
        let user = await userService.userExist(DTO.email, DTO.studentID);
        if (user) {
            return done(null, false, { statusCode: 401, status: 'Unauthorized', msg: ['Your email or studentID already existed'] });
        }
        let newUser = await userService.createUser(DTO);
        if (newUser) {
            return done(null, newUser, { statusCode: 200, status: 'Authorized' });
        }
        else return done(null, false, { statusCode: 401, status: 'Unauthorized', msg: ['Unable to create your account'] });
    }
}));