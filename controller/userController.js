const Joi = require('@hapi/joi');

const userService = require('../services/userService')
async function createNewAcount(req, email, pass, done) {
    const signUpSchema = Joi.object({
        email: Joi.string().email().required(),
        pwd: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
        birthday: Joi.number().integer().min(1900).max(2100),
        university: Joi.string(),
        studentID: Joi.string().required()
    });
    let DTO = req.body;
    let valid = signUpSchema.validate(DTO, { abortEarly: false });
    if (valid.error) {
        return done(null, false, { statusCode: 401, status: 'unauthorized', msg:valid.error.details.map(err=>err.message)});
    }
    let user = await userService.isUserExist(DTO.email, DTO.studentID);
    if (user) {
        return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['User is already existed'] });
    } else {
        let newUser = await userService.createUser(DTO);
        if (newUser) {
            return done(null, newUser, { statusCode: 200, status: 'authorized'});
        }
        else return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['Save user fail'] });
    }
};
module.exports = { createNewAcount }