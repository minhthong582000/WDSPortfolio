const Joi = require('@hapi/joi');
const userService = require('../services/userService');
const mail = require('../config/nodemailder')
module.exports.createNewAccount = async function (req, email, pass, done) {
    const signUpSchema = Joi.object({
        email: Joi.string().email().required(),
        pwd: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
        birthday: Joi.number().integer().min(1900).max(2100),
        university: Joi.string().required(),
        studentID: Joi.string().required()
    });
    let DTO = req.body;
    let valid = await signUpSchema.validate(DTO, { abortEarly: false });
    if (valid.error) {
        return done(null, false, { statusCode: 401, status: 'unauthorized', msg: await valid.error.details.map(err => err.message) });
    } else {
        let user = await userService.userExist(DTO.email, DTO.studentID);
        if (user) {
            return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['Your email or studentID already existed'] });
        }
        let newUser = await userService.createUser(DTO);
        if (newUser) {
            return done(null, newUser, { statusCode: 200, status: 'authorized' });
        }
        else return done(null, false, { statusCode: 401, status: 'unauthorized', msg: ['Unable to create your account'] });
    }
};
module.exports.forgotPassword = async function (req, res, next) {
    let DTO = req.body
    let user = userService.userExist(DTO.email, DTO.studentID);
    if (user) {
        let token = await userService.setRandomToken(DTO.email);
        mail.resetmail(token, DTO.email)
        res.status(200).json({
            "status": "OK",
            "msg": ["Mail was sent"]
        });
    }
    else {
        res.status(301).json({
            "status": "false",
            "msg": ["User not found"]
        });
    }
}
module.exports.setNewPassword = async function (req, res, next) {
    let token = req.params.token;
    let newpwd = req.body.pwd;
    let user = await userService.findUserByToken(token);
    if (user) {
        userService.updatePwdById(user._id, newpwd)
        res.redirect('/')
    }
    else {
        res.status(301).json({
            "status": "false",
            "msg": ["Token not found "]
        });
    }
}
module.exports.setAvatarURL = function (req, res, next) {
    let url = req.body.avatarURL;
    let userID = req.user;
    userService.setImgURL(url, userID);
}
