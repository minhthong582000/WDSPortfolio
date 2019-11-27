const userModel = require('../models/user');

module.exports.createUser = async function(userDTO, done) {
    let newUser = new userModel({ ...userDTO });
    newUser.pwd = await newUser.encryptPassword(newUser.pwd);
    await newUser.save(function (err) {
        if (err)
            throw err;
    });
    return newUser;
}

module.exports.userExist = async function(email, studentID) {
    try {
        let emailExist = await userModel.findOne({'email': email});
        let studentIDExist = await userModel.findOne({'studentID': studentID});
        return (emailExist || studentIDExist)? true : false;
    } catch (err) {
        return false;
    }
}

module.exports.removeByEmail = async function(email) {
    return await userModel.findOneAndDelete(email);
}

module.exports.updateEmail = async function(userDTO, replaceDTO) {
    let useremail = userDTO.email;
    let replaceUserEmail = replaceDTO.replaceEmail
    try {
        await Post.findOneAndUpdate(useremail, replaceUserEmail);
    } catch (err) {
        // console.log('something went wrong when replace email')
    }
}

module.exports.updateByID = async function(updateDoc) {
    let { id, ...userDTO } = updateDoc;
    try {
        await userModel.findByIdAndUpdate(id, userDTO)
    } catch (err) {
        return false;
        // console.log('email is not exist')
    }
}

module.exports.setAvtURL = async function(id, url) {
    try {
        await userModel.findByIdAndUpdate(id, {"avatarURL": url});
    } catch(err) {
        console.log(err);
    }
}
