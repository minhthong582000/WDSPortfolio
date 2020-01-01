const userModel = require('../models/user');
const mail = require('../config/nodemailder')
const crypto = require('crypto');
module.exports.createUser = async function (userDTO, done) {
    let newUser = new userModel({ ...userDTO });
    await newUser.save(function (err) {
        if (err)
            throw err;
    });
    return newUser;
}
module.exports.userExist = async function (email, studentID) {
    try {
        let emailExist = await userModel.findOne({ 'email': email });
        let studentIDExist = await userModel.findOne({ 'studentID': studentID });
        return (emailExist || studentIDExist) ? true : false;
    } catch (err) {
        return false;
    }
}

module.exports.removeByEmail = async function (email) {
    return await userModel.findOneAndDelete(email);
}

module.exports.updateEmail = async function (userDTO, replaceDTO) {
    let useremail = userDTO.email;
    let replaceUserEmail = replaceDTO.replaceEmail
    try {
        await Post.findOneAndUpdate(useremail, replaceUserEmail);
    } catch (err) {
        // console.log('something went wrong when replace email')
    }
}

module.exports.setAvtURL = async function (id, url) {
    try {
        await userModel.findByIdAndUpdate(id, { "avatarURL": url });
    } catch (err) {
        console.log(err);
    }
}
//pass reset
module.exports.findUserByToken = async function (token, done) {
    return await userModel.findOne({
        "pwdreset.token": token,
        "pwdreset.expire": { $gt: Date.now() }
    })
};
// module.exports.findUserByToken = async function (token, done) {
//     return await userModel.findOne({
//         pwdreset: {
//             token: token,
//             expire: { $gt: Date.now() }
//         }
//     }, (err, docs) => console.log(docs)
//     )
// };
module.exports.updatePwdById = async function (id, newPwd) {
    await userModel.findByIdAndUpdate(id, { pwd: newPwd }, { useFindAndModify: true })
}
module.exports.setRandomToken = async function (email) {
    let token = crypto.randomBytes(10).toString('hex');
    let info = { email: email };
    let update = {
        pwdreset: {
            token: token,
            expire: Date.now() + (process.env.Token_Expire_Time * 1000 || 300 * 1000)
        }
    };
    userModel.updateOne(info, update, { useFindAndModify: false }, function (err, doc) {
        if (err) throw err;
        return false;
    });
    return token;
}