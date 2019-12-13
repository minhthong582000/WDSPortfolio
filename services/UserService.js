const usermodel = require('../models/user')
const createUser = async function (userDTO, done) {
    let newUser = new usermodel({ ...userDTO })
    if (newUser.pwd) {
        newUser.pwd = await newUser.encryptPassword(newUser.pwd)
    }
    await newUser.save(function (err) {
        if (err)    
            throw err;
    });
    return newUser;
}

const isUserExist = async function (email, studentID) {
    try {
        let oldemail = await usermodel.findOne({ 'email': email })
        let oldSID = await usermodel.findOne({ 'studentID': studentID })
        if (oldemail || oldSID) {
            return true;
        }
        else return false;
    }
    catch (err) {
        return false;
    }
}
// const isGGUserExist = async function (googleid) {
//     try {
//         let oldgguser = await usermodel.findOne({ googleid: googleid });
//         if (oldgguser) {
//             return oldgguser;
//         }
//         else return false;
//     }
//     catch (err) {
//         return false;
//     }
// }
module.exports = {
    createUser,
    isUserExist,
    isGGUserExist
}
