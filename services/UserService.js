const usermodel = require('../models/user')
const createUser = async function (userDTO, done) {
        let newUser = new usermodel({ ...userDTO });
        newUser.pwd = await newUser.encryptPassword(newUser.pwd);
        await newUser.save(function (err){
            if (err)
            console.log(err)
        }
    );
    return newUser;
}
// const removeUserByFindOne = async function (email) {
//     return await usermodel.findByIdAndDelete(email);
// }
const isUserExist = async function (email, studentID) {
    try {
        let thisemailUser = await usermodel.findOne({ 'email': email })
        let thisstudentIDUser = await usermodel.findOne({ 'studentID': studentID })
        if (thisemailUser || thisstudentIDUser) {
            return true;
        }
        else return false;
    }
    catch (err) {
        console.log(err);
        return false;
        // console.log('email is not exist')
    }
}
// const replaceEmail = async function (userDTO, replaceDTO) {
//     let useremail = userDTO.email;
//     let replaceUserEmail = replaceDTO.replaceEmail
//     try {
//         await Post.findOneAndUpdate(useremail, replaceUserEmail);
//     } catch (err) {
//         // console.log('something went wrong when replace email')
//     }
// }
// const updateByID = async function (updateDoc) {
//     let { id, ...userDTO } = updateDoc;
//     try {
//         await usermodel.findByIdAndUpdate(id, userDTO)
//     }
//     catch (err) {
//         return false;
//         // console.log('email is not exist')
//     }
// }
module.exports = {
    createUser,
    isUserExist
}