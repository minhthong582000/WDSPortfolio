const userModel = require('../models/user');

module.exports.createUser = async function(userDTO) {
     try {
        let newUser = new userModel({ ...userDTO });
        newUser.pwd = await newUser.encryptPassword(newUser.pwd);
        await newUser.save(function (err) {
            if (err) 
                throw err;
        });
        return newUser;
     } catch(err) {
        console.log(err);
     }
}

module.exports.findByID = async (_id)=>{
    try {
        let result = await userModel.findById(_id, (err)=>{
            if (err) 
                throw err;
        });
        return result;
    } catch(err) {
        console.log(err);
    }
}

module.exports.userExist = async function(email, studentID) {
    try {
        let emailExist = await userModel.findOne({'email': email});
        let studentIDExist //= await userModel.findOne({'studentID': studentID});
        return (emailExist || studentIDExist)? true : false;
    } catch (err) {
        return false;
    }
}

module.exports.removeByEmail = async function(email) {
    return await userModel.findOneAndDelete(email);
}

module.exports.updateEmail = async function(userDTO, replaceDTO) {
    let userEmail = userDTO.email;
    let replacedEmail = replaceDTO.replaceEmail
    try {
        await Post.findOneAndUpdate(userEmail, replacedEmail);
    } catch (err) {
        // console.log('something went wrong when replace email')
    }
}

module.exports.updateByID = async function(updateDoc) {
    let { id, ...userDTO } = updateDoc;
    try {
        await userModel.findByIdAndUpdate(id, userDTO);
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
