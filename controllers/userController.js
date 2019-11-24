const UserModel = require('../models/user')
const password = require('../services/password')
const { body, validationResult } = require('express-validator');




module.exports.deleteByStudentID = async (req, res, next) => {
    //check login and is admin
    adminId = req.signedCookies._id
    if (user && user.role == 'admin') {
        //find and delete
        user = await UserModel.findById(adminId)
        const studentID = req.params.studentID
        await UserModel.findOneAndDelete({ studentID: studentID })
        return res.redirect('/admin');
    }
    return res.status(403).json({
        errors: "You have not permission to do"
    })
}


module.exports.updateByStudentID = async (req, res, next) => {
    //check login and is admin
    adminId = req.signedCookies._id
    user = await UserModel.findById(adminId)

    if (user && user.role == 'admin') {
        //find user to update
        updateUser = await UserModel.findOne({ studentID: req.params.studentID })
        if (updateUser) {
            if (req.body.email) {
                await body('email').isEmail().withMessage('must be a valid email').run(req);
            }
            if (req.body.pwd) {
                await body('pwd').matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
                    .withMessage("Password must contain at least 1 lowercase, uppercase, numeric, special character and must be eight characters or longer").run(req)
            }
            if (req.body.university) {
                await body('university').isAlphanumeric().withMessage("University must be string").run(req)
            }
            if (req.body.role) {
                await body('role').isIn(UserModel.schema.path('role').enumValues)
                    .withMessage("Role must be Guest, member or admin").run(req)
            }

            if (req.body.studentID) {
                await body('studentID').isNumeric()
                    .withMessage("Student ID must be numeric characters").run(req)
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            //hash password
            if (req.body.pwd) {
                req.body.pwd = password.hashPwd(req.body.pwd);
            }

            await UserModel.findOneAndUpdate({ studentID: req.params.studentID }, req.body);
            return res.redirect('/admin');
        }
        return res.status(404).json({ errors: "Can't find user" })
    }
    return res.redirect('/login');

}


module.exports.create = async (req, res, next) => {
    try {
        new_user = new UserModel({
            email: req.body.email,
            pwd: password.hashPwd(req.body.pwd),
            university: req.body.university,
            studentID: req.body.studentID,
        })
    } catch (error) {
        return next(error);
    }
    await new_user.save();
    return res.redirect('/admin');
}

module.exports.index = async (req, res, next) => {
    const users = await UserModel.find();
    return res.json(users)
}