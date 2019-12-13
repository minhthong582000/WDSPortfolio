const userService = require('../services/userService')
const Joi = require('@hapi/joi');
const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    googleid: Joi.string(),
    pwd: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    birthday: Joi.number().integer().min(1900).max(2100),
    university: Joi.string(),
    studentID: Joi.string()
});
async function createNewAcountLocal(req, email, pass, done) {
    let DTO = req.body;
    let valid = signUpSchema.validate(DTO, { abortEarly: false });
    if (valid.error) {
        return done(null, false, { statusCode: 401, status: 'unauthorized', msg: await valid.error.details.map(err => err.message) });
    }
    let user = await userService.isUserExist(DTO.email, DTO.studentID);
    if (user) {
        return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['User is already existed'] });
    } else {
        let newUser = await userService.createUser(DTO);
        if (newUser) {
            return done(null, newUser, { statusCode: 200, status: 'authorized' });
        }
        else return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['Save user fail'] });
    }
};
async function googleLogin(accessToken, refreshToken, profile, done) {
    let user = await userService.isGGUserExist(profile.id);
    let email = profile.emails[0].value;
    if (user) {
        return done(null, user);
    } else {
        let newUser = await userService.createUser({ email: email, googleid: profile.id });
        if (newUser) {
            return done(null, newUser);
        }
        else return done(null, false);
    }
}
module.exports = {
    createNewAcountLocal,
    googleLogin
}