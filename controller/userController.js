const userService = require('../services/userService')
async function createNewAcount(req, email, pass, done) {
    let DTO = req.body;
    let user = await userService.isUserExist(DTO.email, DTO.studentID);
    if (user) {
        return done(null, false, {
            message: "Incorrect email."
        });
    } else {
        let newUser = await userService.createUser(DTO);
        return done(null, newUser,{
            message: "success"
          });
    }
};
module.exports = { createNewAcount }