const UserModel = require('../models/user')
const password = require('../middleware/password')



module.exports.deleteByStudentID = async (req, res, next) => {
    const studentID = req.body.studentID
    await UserModel.findOneAndDelete({studentID: studentID})
    return res.redirect('/admin');
}


module.exports.updateByStudentID = async (req, res, next) => {
    if (req.body.pwd) {
        req.body.pwd = password.hashPwd(req.body.pwd);
    }
    const {studentID, ...updateDocs} = req.body;
    await UserModel.findOneAndUpdate({studentID: studentID},updateDocs);
    return res.redirect('/admin');
}


module.exports.create = async (req, res, next) => {
    try {
        new_user = new UserModel ({
            email:req.body.email,
            pwd:password.hashPwd(req.body.pwd),
            university:req.body.university,
            studentID:req.body.studentID,
        })
    } catch(error) {
        return next(error);
    }
    await new_user.save();
    return res.redirect('/admin');
}

module.exports.index = async (req, res, next) => {
    const users = await UserModel.find();
    return res.json(users)
}