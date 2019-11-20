const userService = require('../services/userService')
async function createNewAcount(req, email, pass, done) {
    let DTO = req.body;
    let user = await userService.isUserExist(DTO.email, DTO.studentID);
    if (user) {
        return done(null, false,{statusCode :401,status:'unauthorized',msg:'User is already existed'}); // phần object ở sau có cho vui chứ chả dùng tới ..
    } else {
        let newUser = await userService.createUser(DTO);
        if (newUser) {
            return done(null, newUser,{statusCode :200,status:'authorized',msg:'Signup success'});
        }
        else return done(null, false,{statusCode :401,status:'unauthorized',msg:'Save user fail' });
    }
};
module.exports = { createNewAcount }