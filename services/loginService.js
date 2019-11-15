const usermodel = require('../models/user')
const createuser = async function (userDTO) {
    const newUser = new usermodel({ ...userDTO });
    await newUser.save();
}
const removeUserByFindOne = async function (email) {
    return await usermodel.findByIdAndDelete(email);
}
const checkUserExist = async function (email) {
    try {
        const data = await usermodel.find(email)
        if (data) {
            return true;
        }
        else return false;
    }
    catch (eror) {
        return false;
        console.log('email is not exist')
    }
} 
const replaceEmail = async function (userDTO, replaceDTO) {
    const useremail = userDTO.email;
    const replaceUserEmail = replaceDTO.replaceEmail
    try {
        await Post.findOneAndUpdate(useremail, replaceUserEmail);
    } catch (err) {
        // console.log('something went wrong when replace email')
    }
}